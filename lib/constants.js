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
		Modal: {
			ENABLE_DIY: {
				key: 'EnablePackageDiy',
				title: `DIY your package`,
				description:
					'Would you like to start DIY your trip? An extra fee will be applied.',
			},
			DELETE_ITINERARY: {
				key: 'DeleteItinerary',
				title: `Delete #Day#`,
				description:
					'Would you like to delete #Day#? Please Click Yes to continue.',
			},
			FAILED_DELETE_ITINERARY: {
				key: 'FailedDeleteItinerary',
				title: `Failed to delete #Day#`,
				description:
					'#Day# cannot be deleted, because #Attractions# cannot be skipped of the day.',
			},
			ADD_ITINERARY: 'AddItinerary',
			button: {
				YES: 'Yes',
				NO: 'No',
				OK: 'Ok',
			},
		},
	};
};
