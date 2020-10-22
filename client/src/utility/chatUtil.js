import store from '../mainStore';

export let getFriendDetailFromChat = chatObj => {
	let { currentUser } = store.state.userstore;
	let [ friend ] = chatObj.participants.filter(participant => participant._id !== currentUser._id);
	return friend;
}