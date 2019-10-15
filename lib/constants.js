exports.get = () => {
	return {
		Global: {
			dateFormat: 'DD/MM/YYYY',
			timePlannable: 8,
			minDaysAhead: 7,
			minCarTime: 4,
			maxCarTime: 8,
			standardRoomCapacity: 2,
			maxRoomCapacity: 3,
			idxLastItem: 999,
		},
		Steps: {
			diy: ['Select Attraction', 'Select Hotel', 'Lock Your Deal'],
			regular: ['View Itinerary', 'Lock Your Deal'],
		},
		Instance: {
			status: {
				INITIATED: 'Initiated',
				INPROGRESS: 'InProgress',
				COMPLETED: 'Completed',
				SELECT_ATTRACTION: 'SelectAttraction',
				SELECT_HOTEL: 'SelectHotel',
				DEPOSIT_PAID: 'DepositPaid',
				FULLY_PAID: 'FullyPaid',
			},
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
			ADD_ITINERARY: {
				key: 'AddItinerary',
				title: `Add one more day after #Day#`,
				description:
					'Would you like to add one more day after #Day#? Please Click Yes to continue.',
			},
			FULL_ITINERARY: {
				key: 'FullItinerary',
				title: `#Day# fully booked`,
				description:
					'Your itinerary of #Day# has been fully booked. Please add one more day.',
			},
			ONLY_ITINERARY: {
				key: 'OnlyItinerary',
				title: `The only attraction cannot be deleted`,
				description:
					'Your itinerary of #Day# has only one activity planned. Thus, it cannot be deleted.',
			},
			INVALID_MIN_PARTICIPANT: {
				key: 'InvalidMinParticipant',
				title: `The minimum hasn't been met`,
				description: 'This tour needs to have #Min#.',
			},
			INVALID_MAX_PARTICIPANT: {
				key: 'InvalidMaxParticipant',
				title: `The maximum has been exceeded`,
				description: 'This tour can only have #Max#.',
			},
			button: {
				YES: 'Yes',
				NO: 'No',
				OK: 'Ok',
			},
		},
	};
};
