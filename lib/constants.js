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
			type: {
				TEMPLATE: 'Template',
				SNAPSHOT: 'Snapshot',
			},
		},
	};
};
