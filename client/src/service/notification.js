const isAllowed = () => Notification.permission === 'granted';

const isDenied = () => Notification.permission === 'denied';

const requestPermission = () => Notification.requestPermission();

class Notify{
	constructor(params) {
		const defaultparams = {
			title: '',
			body: '',
			onClick: () => {}
		}
		this.params = Object.assign({}, defaultparams, params);
		this.init();
	}

	init() {
		isAllowed() ? this.show() : this.request();
	}

	show() {
		if (document.hasFocus()) {
			return;
		}
		let { title, body } = this.params;
		this.notification = new Notification(title, { 
			body,
			icon : '../assets/img/chat_icon.png'
		});
		this.setEvents();
	}

	setEvents() {
		this.notification.onclick = () => {
			window.focus();
			this.notification.close();
			this.params.onClick();
		}
	}

	request() {
		!isDenied && requestPermission();
	}
}

export const showNotification = params => {
	if (window.Notification) {
		new Notify(params);
	}
};