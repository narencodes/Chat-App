import { LOGO_URL } from "@/utility/constants";
import { formatImgURL } from "@/utility/utils";

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
		isAllowed() ? this.show() : requestPermission();
	}

	show() {
		if (document.hasFocus()) {
			return;
		}
		let { title, body } = this.params;
		this.notification = new Notification(title, { 
			body,
			icon : formatImgURL(this.params.icon || LOGO_URL)
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
}

export const showNotification = params => {
	if (window.Notification) {
		!isDenied() && new Notify(params);
	}
};