import { Selector } from 'testcafe';

fixture`Use build-in assertions`.page`http://localhost:3000/`;

class Page {
	constructor() {
		this.pageTitle = Selector('h1.title');
		this.sidebarWrapper = Selector('#appSidebar');
		this.appSidebar = Selector('#appSidebar > div > ul');
		this.getAnchorByHref = Selector(url => document.querySelector(`#appSidebar a[href^="${url}"]`));
		this.menuBtn = Selector('#navbarSupportedContent > div.navbar-toggle > button');
		this.menuLinks = {
			home: Selector(this.getAnchorByHref('/app/dashboard')),
			campaigns: Selector(this.getAnchorByHref('/app/campaigns/list')),
			creatives: Selector(this.getAnchorByHref('/app/creatives/list')),
		};
	}
}

const page = new Page();

test('Test TradingDesk Dashboard', async t => {
	await t
		.resizeWindowToFitDevice('Sony Xperia Z', {
			portraitOrientation: true,
		})
		.expect(page.sidebarWrapper.getStyleProperty('transform'))
		.eql('matrix(1, 0, 0, 1, -260, 0)')
		.click(page.menuBtn)
		.expect(page.sidebarWrapper.getStyleProperty('transform'))
		.eql('matrix(1, 0, 0, 1, 0, 0)')
		.maximizeWindow()
		.expect(page.pageTitle.textContent)
		.contains('Trading Desk Dashboard')
		.expect(page.appSidebar.child('li').count)
		.gte(13, 'не хватает пунктов в меню')
		.click(page.menuLinks.campaigns)
		.expect(page.pageTitle.textContent)
		.contains('List campaigns')
		.click(page.menuLinks.creatives)
		.expect(page.pageTitle.textContent)
		.contains('Creative list');
});
