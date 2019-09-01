exports.get = () => {
	return {
		Global: {
			dateFormat: 'DD/MM/YYYY',
		},
		TravelPackage: {
			status: {
				DRAFT: 'Draft',
				PUBLISHED: 'Published',
				ARCHIVED: 'Archived',
			},
			carOption: {
				REGULAR: 'Regular',
				PREMIUM: 'Premium',
				LUXURY: 'Luxury',
			},
			type: {
				TEMPLATE: 'Template',
				SNAPSHOT: 'Snapshot',
			},
		},
	};
};
