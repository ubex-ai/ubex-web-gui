export const category = [
	{
		label: 'News',
		value: 'news',
	},
	{
		label: 'Shop',
		value: 'shop',
	},
	{
		label: 'Blog',
		value: 'blog',
	},
];

export const sizes = [
	{
		value: 'Horizontal',
		label: '2x1',
		transition_fixed_size: ['Half Page'],
		aspect_ratio: {
			width: 2,
			height: 1,
		},
		ad_size: 'X Large',
		size_range_min_size: {
			width: 900,
			height: 450,
		},
		size_range_max_size: {
			width: 1800,
			height: 900,
		},
		max_k_weight_initial_load: 250,
		max_k_weight_subload: 500,
		static_image_size: {
			width: 1800,
			height: 900,
		},
	},
	{
		value: 'Horizontal',
		label: '2x1',
		aspect_ratio: {
			width: 2,
			height: 1,
		},
		ad_size: 'Small',
		size_range_min_size: {
			width: 300,
			height: 150,
		},
		size_range_max_size: {
			width: 450,
			height: 225,
		},
		max_k_weight_initial_load: 100,
		max_k_weight_subload: 200,
		static_image_size: {
			width: 450,
			height: 225,
		},
	},
	{
		value: 'Horizontal',
		label: '4x1',
		transition_fixed_size: ['Billboard', '970x250'],
		aspect_ratio: {
			width: 4,
			height: 1,
		},
		ad_size: 'X Large',
		size_range_min_size: {
			width: 900,
			height: 225,
		},
		size_range_max_size: {
			width: 1800,
			height: 450,
		},
		max_k_weight_initial_load: 250,
		max_k_weight_subload: 500,
		static_image_size: {
			width: 1800,
			height: 450,
		},
	},
	{
		value: 'Horizontal',
		label: '6x1',
		transition_fixed_size: ['Smartphone Banner', '300x50', '320x50'],
		aspect_ratio: {
			width: 6,
			height: 1,
		},
		ad_size: 'X Small',
		size_range_min_size: {
			width: 300,
			height: 50,
		},
		size_range_max_size: {
			width: 450,
			height: 75,
		},
		max_k_weight_initial_load: 50,
		max_k_weight_subload: 100,
		static_image_size: {
			width: 450,
			height: 75,
		},
	},
	{
		value: 'Horizontal',
		label: '8x1',
		transition_fixed_size: ['Leaderboard', '728x90'],
		aspect_ratio: {
			width: 8,
			height: 1,
		},
		ad_size: 'Medium',
		size_range_min_size: {
			width: 600,
			height: 75,
		},
		size_range_max_size: {
			width: 1200,
			height: 150,
		},
		max_k_weight_initial_load: 150,
		max_k_weight_subload: 300,
		static_image_size: {
			width: 1200,
			height: 150,
		},
	},
	{
		value: 'Horizontal',
		label: '10x1',
		transition_fixed_size: ['Super Leaderboard', 'Pushdown', '970x90'],
		aspect_ratio: {
			width: 10,
			height: 1,
		},
		ad_size: 'Large',
		size_range_min_size: {
			width: 900,
			height: 90,
		},
		size_range_max_size: {
			width: 1800,
			height: 180,
		},
		max_k_weight_initial_load: 200,
		max_k_weight_subload: 400,
		static_image_size: {
			width: 1800,
			height: 180,
		},
	},
	{
		value: 'Vertical',
		label: '1x2',
		transition_fixed_size: ['300x600'],
		aspect_ratio: {
			width: 1,
			height: 2,
		},
		ad_size: 'Large',
		size_range_min_size: {
			width: 300,
			height: 600,
		},
		size_range_max_size: {
			width: 450,
			height: 900,
		},
		max_k_weight_initial_load: 200,
		max_k_weight_subload: 400,
		static_image_size: {
			width: 450,
			height: 900,
		},
	},
	{
		value: 'Vertical',
		label: '1x3',
		transition_fixed_size: ['Portrait', '300x1050'],
		aspect_ratio: {
			width: 1,
			height: 3,
		},
		ad_size: 'X Large',
		size_range_min_size: {
			width: 300,
			height: 900,
		},
		size_range_max_size: {
			width: 450,
			height: 1350,
		},
		max_k_weight_initial_load: 250,
		max_k_weight_subload: 500,
		static_image_size: {
			width: 450,
			height: 1350,
		},
	},
	{
		value: 'Vertical',
		label: '1x4',
		transition_fixed_size: ['Skyscraper', '160x600'],
		aspect_ratio: {
			width: 1,
			height: 4,
		},
		ad_size: 'Medium',
		size_range_min_size: {
			width: 160,
			height: 640,
		},
		size_range_max_size: {
			width: 240,
			height: 960,
		},
		max_k_weight_initial_load: 150,
		max_k_weight_subload: 300,
		static_image_size: {
			width: 240,
			height: 960,
		},
	},
	{
		value: 'Tiles',
		label: '1x1',
		transition_fixed_size: ['Medium Rectangle', '300x250'],
		aspect_ratio: {
			width: 1,
			height: 1,
		},
		ad_size: 'Medium',
		size_range_min_size: {
			width: 300,
			height: 300,
		},
		size_range_max_size: {
			width: 450,
			height: 450,
		},
		max_k_weight_initial_load: 150,
		max_k_weight_subload: 300,
		static_image_size: {
			width: 450,
			height: 450,
		},
	},
	{
		value: 'Tiles',
		label: '2x1',
		transition_fixed_size: ['120x60', 'Financial'],
		aspect_ratio: {
			width: 2,
			height: 1,
		},
		ad_size: 'X Small',
		size_range_min_size: {
			width: 200,
			height: 100,
		},
		size_range_max_size: {
			width: 300,
			height: 150,
		},
		max_k_weight_initial_load: 50,
		max_k_weight_subload: 100,
		static_image_size: {
			width: 300,
			height: 150,
		},
	},
	{
		value: 'Full Page Portrait',
		label: '9x16',
		aspect_ratio: {
			width: 9,
			height: 16,
		},
		ad_size: 'Large',
		size_range_min_size: {
			width: 300,
			height: 540,
		},
		size_range_max_size: {
			width: 450,
			height: 800,
		},
		max_k_weight_initial_load: 200,
		max_k_weight_subload: 400,
		static_image_size: {
			width: 450,
			height: 800,
		},
	},
	{
		value: 'Full Page Portrait',
		label: '9x16',
		aspect_ratio: {
			width: 9,
			height: 16,
		},
		ad_size: 'X Large',
		size_range_min_size: {
			width: 600,
			height: 1067,
		},
		size_range_max_size: {
			width: 900,
			height: 1600,
		},
		max_k_weight_initial_load: 300,
		max_k_weight_subload: 600,
		static_image_size: {
			width: 900,
			height: 1600,
		},
	},
	{
		value: 'Full Page Portrait',
		label: '10x16',
		aspect_ratio: {
			width: 10,
			height: 16,
		},
		ad_size: 'X Large',
		size_range_min_size: {
			width: 800,
			height: 1280,
		},
		size_range_max_size: {
			width: 1200,
			height: 1920,
		},
		max_k_weight_initial_load: 300,
		max_k_weight_subload: 600,
		static_image_size: {
			width: 1200,
			height: 1920,
		},
	},
	{
		value: 'Full Page Portrait',
		label: '2x3',
		aspect_ratio: {
			width: 2,
			height: 3,
		},
		ad_size: 'Large',
		size_range_min_size: {
			width: 300,
			height: 450,
		},
		size_range_max_size: {
			width: 450,
			height: 675,
		},
		max_k_weight_initial_load: 200,
		max_k_weight_subload: 400,
		static_image_size: {
			width: 450,
			height: 675,
		},
	},
	{
		value: 'Full Page Portrait',
		label: '3x4',
		aspect_ratio: {
			width: 3,
			height: 4,
		},
		ad_size: 'X Large',
		size_range_min_size: {
			width: 600,
			height: 800,
		},
		size_range_max_size: {
			width: 900,
			height: 1200,
		},
		max_k_weight_initial_load: 300,
		max_k_weight_subload: 600,
		static_image_size: {
			width: 900,
			height: 1200,
		},
	},
	{
		value: 'Full Page Landscape',
		label: '16x9',
		aspect_ratio: {
			width: 16,
			height: 9,
		},
		ad_size: 'Large',
		size_range_min_size: {
			width: 540,
			height: 300,
		},
		size_range_max_size: {
			width: 800,
			height: 450,
		},
		max_k_weight_initial_load: 200,
		max_k_weight_subload: 400,
		static_image_size: {
			width: 800,
			height: 450,
		},
	},
	{
		value: 'Full Page Landscape',
		label: '16x9',
		aspect_ratio: {
			width: 16,
			height: 9,
		},
		ad_size: 'X Large',
		size_range_min_size: {
			width: 1067,
			height: 600,
		},
		size_range_max_size: {
			width: 1600,
			height: 900,
		},
		max_k_weight_initial_load: 300,
		max_k_weight_subload: 600,
		static_image_size: {
			width: 1600,
			height: 900,
		},
	},
	{
		value: 'Full Page Landscape',
		label: '16x10',
		aspect_ratio: {
			width: 16,
			height: 10,
		},
		ad_size: 'X Large',
		size_range_min_size: {
			width: 1280,
			height: 800,
		},
		size_range_max_size: {
			width: 1920,
			height: 1200,
		},
		max_k_weight_initial_load: 300,
		max_k_weight_subload: 600,
		static_image_size: {
			width: 1920,
			height: 1200,
		},
	},
	{
		value: 'Full Page Landscape',
		label: '3x2',
		aspect_ratio: {
			width: 3,
			height: 2,
		},
		ad_size: 'Large',
		size_range_min_size: {
			width: 450,
			height: 300,
		},
		size_range_max_size: {
			width: 675,
			height: 450,
		},
		max_k_weight_initial_load: 200,
		max_k_weight_subload: 400,
		static_image_size: {
			width: 675,
			height: 450,
		},
	},
	{
		value: 'Full Page Landscape',
		label: '4x3',
		aspect_ratio: {
			width: 4,
			height: 3,
		},
		ad_size: 'X Large',
		size_range_min_size: {
			width: 800,
			height: 600,
		},
		size_range_max_size: {
			width: 1200,
			height: 900,
		},
		max_k_weight_initial_load: 300,
		max_k_weight_subload: 600,
		static_image_size: {
			width: 1200,
			height: 900,
		},
	},
	{
		value: 'Feature Phone Sizes',
		label: '120x20',
		transition_fixed_size: ['Small Banner'],
		size_range_max_size: {
			width: 120,
			height: 20,
		},
		max_k_weight_initial_load: 5,
	},
	{
		value: 'Feature Phone Sizes',
		label: '168x28',
		transition_fixed_size: ['Medium Banner'],
		size_range_max_size: {
			width: 168,
			height: 28,
		},
		max_k_weight_initial_load: 5,
	},
	{
		value: 'Feature Phone Sizes',
		label: '216x36',
		transition_fixed_size: ['Large Banner'],
		size_range_max_size: {
			width: 216,
			height: 36,
		},
		max_k_weight_initial_load: 5,
	},
];
export default category;
