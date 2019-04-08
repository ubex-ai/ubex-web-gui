**Collection Helper**

В контексте приложения Redux

Это набор функций для генерации других функций. 
Несколько функций генерит функциональный интерфейс для нашего Redux-стэка, 
который состоит из 5 частей:

- **reducer** - контролирует структуру данных в сторе.
- **selector** - выбирает данные из стора
- **action** - (или constant) определяет набор действий
- **actionCreator** - возвращает объект действия
- **saga** - обеспечивает контроль за асинхронными действиями

Для того чтобы добавить в приложение возможность работы с какой то новой структурой данных,
нужно сгенерировать функциональный интерфейс, используя соответсвующие функции из **Collection Helper**.

С какими типами данных мы работаем?

**Статичные данные**

Те данные которые задаются изначально при инициализации прямо в приложении и не меняются в дальнейшем.
Для таких данных достаточно:
1) Задать структуру в store:
	
	`initialState = fromJS({bundleId: '123'})`
2) Выбрать эти данные из store через selector.
	
	`createSelector(store.get('publisher'), 
		subdomain => subdomain.get('bundleId'))`
 
**Данные на клиенте**

Те данные, которые задаются и меняются исключительно на клиенте. 
Например селектор выбора даты, флаг загрузки приложения и т.п.

Отличие от статичных данных только в том, что нам нужно:
1) Послать сигнал на изменение данных

	`dispatch({type: 'changeDate' payload: '2019-03-19'})`
2) Изменить данные в store используя reducer _(subdomain тут уже выбран)_
	
	`changeDate: (state, action) => state.set('date', action.payload)`

**Данные из API**

Передача данных через сеть накладывает риски на работоспособность приложения, 
поэтому очень важно иметь возможность контролировать все аспекты при обращении к серверу.
Т.к. мы не можем контролировать 100% что апи ответ успешно, необходимо обрабатывать ошибки при обращении к серверу 
и выдавать соответвующие сигналы в случае ошибки или успеха.
Для этого приходится держать очень много различных флагов и действий на каждый запрос. 
Для решения этой проблемы был написан CollectionHelper.

**CollectionHelper API**

CollectionHelper работает с двумя типа данных: 

**Списки (Lists)**  - это массив данных получаемых с сервера только для чтения, урезанный случай коллекции.
- Reducer
	- listReducer(collectionName) - редьюссер для работы со списком
	- listInitialState(collectionName) - стуктура данных списка

	Пример:
	```js
		import {listInitialState} from 'utils/CollectionHelper/reducers';

		initialState = fromJS({}).merge(listInitialState('banners'));
		
		export default handleActions(
        	{
        		...listReducer('banners')
        	});
	```
	
	Если нужно чтобы данные авторегедрировались:
	
	`const rehydrateState = {...listRehydrateState('banners')}`

- Actions

	listActionCreator(url, collectionName) - возвращает actionCreator действия  получать список объектов с сервера.
	Пример:
	
	`getBanners = listActionCreator('api/banner', 'banners');`

- Saga
	
	handleRequestListSaga(collectionName) - кидает запрос за списокм, вызывает ошибку или меняет данные в случае успеха.
	
	Пример:
	```js	
		import { handleRequestListSaga } from 'utils/CollectionHelper/saga';
		
		export default function* publisherSaga() {
        	// Подписываемся на действия списка
        	yield handleRequestListSaga(BANNERS_COLLECTION_NAME);
		}
	```
	
	Если нужно выполнить запрос напрямую, в обход redux, например при инициализации приложения, нужно использовать
	getListRequestHandler(actionCreator, {success: actionTypeOnSuccess, error: actionTypeOnError})
	```js
		import { getListRequestHandler } from 'utils/CollectionHelper/saga';

		function* onAppInit() {
		const actionCreator = listActionCreator('api/banner', 'banners');
		const {success, error} = makeListActions('banners');
			yield getListRequestHandler(actionCreator, {success, error});
		}
	```
- Constants
	
	makeListActions(collectionName) - возвращает объект с дейсвтиями, request, success, error;
	
**Коллекции (Collections)** - это массив объектов, имеющих уникальный ID - **Entry**. 
Коллекция может:
- получать список объектов с сервера;
- получить данные об объекте
- отправлять запрос на добавление объекта на сервер и, в случае успеха, добавить новый объект в коллекцию;
- отправить запрос на обновление объекта;
- отправить запрос на удаление объекта
