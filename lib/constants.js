
exports.get = () => {
	return {
        TravelPackage: {
            status: {
                DRAFT: 'Draft',
                PUBLISHED: 'Published',
                ARCHIVED: 'Archived'
            }, 
            type: {
                TEMPLATE: 'Template',
                SNAPSHOT: 'Snapshot',
            }
        }
    };
};
