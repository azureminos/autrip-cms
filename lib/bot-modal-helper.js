const _ = require('lodash');
const CONSTANTS = require('./constants');
const modal = CONSTANTS.get().Modal;

const format = (input, replacements) => {
	const keys = _.keys(replacements);
	_.each(keys, k => {
		input = input.replace(k, replacements[k]);
	});
	return input;
};

exports.getModal = (botModal, handler, refModal) => {
	if (botModal === modal.ENABLE_DIY.key) {
		const pBtnModal = [
			{ title: modal.button.YES, handleClick: handler.enablePackageDiy },
			{ title: modal.button.NO, handleClick: handler.handleModalClose },
		];
		return {
			title: modal.ENABLE_DIY.title,
			description: modal.ENABLE_DIY.description,
			buttons: pBtnModal,
		};
	} else if (botModal === modal.DELETE_ITINERARY.key) {
		const dayNo = `Day ${refModal.dayNo || ''}`;
		const replacements = {
			'#Day#': dayNo,
		};
		const pBtnModal = [
			{ title: modal.button.YES, handleClick: handler.handleDeleteItinerary },
			{ title: modal.button.NO, handleClick: handler.handleModalClose },
		];
		return {
			title: format(modal.DELETE_ITINERARY.title, replacements),
			description: format(modal.DELETE_ITINERARY.description, replacements),
			buttons: pBtnModal,
		};
	} else if (botModal === modal.FAILED_DELETE_ITINERARY.key) {
		const dayNo = `Day ${refModal.dayNo || ''}`;
		const aList = _.filter(refModal.attractions, it => {
			return it.isRequired;
		});
		const attractions = _.map(aList, a => {
			return a.name;
		});
		const replacements = {
			'#Day#': dayNo,
			'#Attractions#': attractions.toString(),
		};
		const pBtnModal = [
			{ title: modal.button.OK, handleClick: handler.handleModalClose },
		];
		return {
			title: format(modal.FAILED_DELETE_ITINERARY.title, replacements),
			description: format(
				modal.FAILED_DELETE_ITINERARY.description,
				replacements
			),
			buttons: pBtnModal,
		};
	} else if (botModal === modal.ADD_ITINERARY.key) {
		const dayNo = `Day ${refModal.dayNo || ''}`;
		const replacements = {
			'#Day#': dayNo,
		};
		const pBtnModal = [
			{ title: modal.button.YES, handleClick: handler.handleAddItinerary },
			{ title: modal.button.NO, handleClick: handler.handleModalClose },
		];
		return {
			title: format(modal.ADD_ITINERARY.title, replacements),
			description: format(modal.ADD_ITINERARY.description, replacements),
			buttons: pBtnModal,
		};
	} else if (botModal === modal.FULL_ITINERARY.key) {
		const dayNo = `Day ${refModal.dayNo || ''}`;
		const replacements = {
			'#Day#': dayNo,
		};
		const pBtnModal = [
			{ title: modal.button.OK, handleClick: handler.handleModalClose },
		];
		return {
			title: format(modal.FULL_ITINERARY.title, replacements),
			description: format(modal.FULL_ITINERARY.description, replacements),
			buttons: pBtnModal,
		};
	} else if (botModal === modal.ONLY_ITINERARY.key) {
		const dayNo = `Day ${refModal.dayNo || ''}`;
		const replacements = {
			'#Day#': dayNo,
		};
		const pBtnModal = [
			{ title: modal.button.OK, handleClick: handler.handleModalClose },
		];
		return {
			title: format(modal.ONLY_ITINERARY.title, replacements),
			description: format(modal.ONLY_ITINERARY.description, replacements),
			buttons: pBtnModal,
		};
	} else if (botModal === modal.INVALID_MAX_PARTICIPANT.key) {
		const max = refModal.max || 0;
		const replacements = {
			'#Max#': max,
		};
		const pBtnModal = [
			{ title: modal.button.OK, handleClick: handler.handleModalClose },
		];
		return {
			title: modal.INVALID_MAX_PARTICIPANT.title,
			description: format(
				modal.INVALID_MAX_PARTICIPANT.description,
				replacements
			),
			buttons: pBtnModal,
		};
	} else if (botModal === modal.INVALID_MIN_PARTICIPANT.key) {
		const min = refModal.min || 0;
		const replacements = {
			'#Min#': min,
		};
		const pBtnModal = [
			{ title: modal.button.OK, handleClick: handler.handleModalClose },
		];
		return {
			title: modal.INVALID_MIN_PARTICIPANT.title,
			description: format(
				modal.INVALID_MIN_PARTICIPANT.description,
				replacements
			),
			buttons: pBtnModal,
		};
	}

	return null;
};
