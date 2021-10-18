export let getFormattedTime = (time = Date.now()) => {
	let date = new Date(time);
	let hour = date.getHours();
	let minute = date.getMinutes();
	return `${formatHour(hour)}:${formatDigit(minute)} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export let formatDigit = digit => digit.toString().length < 2 ? `0${digit}` : digit;

export let formatHour = hour => {
    return hour === 0 
            ? 12
            : hour < 10 
                ? formatDigit(hour) 
                : hour > 12 ? formatHour(hour - 12) : hour.toString();
}

export let getDateUtilities = time => {
	time = new Date(parseInt(time));
	let [day, month, date, year] = time.toDateString().split(" "); // Wed Jun 10 2020
	return {
		day,
		month,
		date,
		year,
		monthNumber : time.getMonth() + 1
	}
}

export const getReadableDate = (timeInMs, withTime = false, splitter = '|') => {
    let { date, month, year } = getDateUtilities(timeInMs);
    let isCurrentYear = year == new Date().getFullYear();
    return `${date} ${month} ${isCurrentYear ? "" : year} 
            ${withTime ? ` ${splitter} ${getFormattedTime(timeInMs)}` : ""}`;
}

export let getFormattedLastSeen = (time = Date.now()) => {
	let text = "last seen";
	let today = new Date().setHours(0,0,0,0);
	let { year : currentYear } = getDateUtilities(today);
	let dayInMs = 24 * 60 * 60 * 1000;
	let weekInMs = dayInMs * 7;
	let { day, date, monthNumber, year} = getDateUtilities(time);
	let formattedTime = getFormattedTime(time);
	switch(true) {
		case time > today:
			return `${text} today at ${formattedTime}`
		case time > (today - dayInMs):
			return `${text} yesterday at ${formattedTime}`
		case time > (today - weekInMs):
			return `${text} ${day} at ${formattedTime}`
		default :
			// return 10/06 if current year and 10/06/2003 if previous and other years
			return `${text} at ${formatDigit(date)}/${formatDigit(monthNumber)}${currentYear !== year ? `/${year}` : ``}`;
	}
}