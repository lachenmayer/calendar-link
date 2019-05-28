"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const querystring_1 = require("querystring");
dayjs_1.default.extend(utc_1.default);
exports.eventify = (event) => {
    event.start = dayjs_1.default(event.start).toDate();
    if (event.end == null) {
        if (event.duration && event.duration.length) {
            const duration = Number(event.duration[0]);
            const unit = event.duration[1];
            event.end = dayjs_1.default(event.start)
                .add(duration, unit)
                .toDate();
        }
        if (event.allDay) {
            event.end = dayjs_1.default(event.start)
                .add(1, "day")
                .toDate();
        }
    }
    return event;
};
const formats = {
    dateTime: "YYYYMMDD[T]HHmmss",
    dateTimeUTC: "YYYYMMDD[T]HHmmss[Z]",
    allDay: "YYYYMMDD"
};
exports.google = (event) => {
    event = exports.eventify(event);
    const format = event.allDay ? formats.allDay : formats.dateTimeUTC;
    const start = dayjs_1.default(event.start)
        .utc()
        .format(format);
    const end = dayjs_1.default(event.end)
        .utc()
        .format(format);
    const details = {
        action: "TEMPLATE",
        text: event.title,
        details: event.description,
        location: event.location,
        trp: event.busy,
        dates: start + "/" + end
    };
    if (event.guests && event.guests.length) {
        details.add = event.guests.join();
    }
    return `https://calendar.google.com/calendar/render?${querystring_1.stringify(details)}`;
};
exports.outlook = (event) => {
    event = exports.eventify(event);
    const format = event.allDay ? formats.allDay : formats.dateTime;
    const start = dayjs_1.default(event.start)
        .utc()
        .format(format);
    const end = dayjs_1.default(event.end)
        .utc()
        .format(format);
    const details = {
        path: "/calendar/action/compose",
        rru: "addevent",
        startdt: start,
        enddt: end,
        subject: event.title,
        body: event.description,
        location: event.location
    };
    return `https://outlook.live.com/owa/?${querystring_1.stringify(details)}`;
};
exports.yahoo = (event) => {
    event = exports.eventify(event);
    const format = event.allDay ? formats.allDay : formats.dateTimeUTC;
    const start = dayjs_1.default(event.start)
        .utc()
        .format(format);
    const end = dayjs_1.default(event.end)
        .utc()
        .format(format);
    const details = {
        v: 60,
        title: event.title,
        st: start,
        et: end,
        desc: event.description,
        in_loc: event.location
    };
    return `https://calendar.yahoo.com/?${querystring_1.stringify(details)}`;
};
//# sourceMappingURL=index.js.map