export interface DataCalendar {
	id?: number;
	title?: string;
	start?: string;
	end?: string;
	backgroundColor?: string;
	borderColor?: string;
	textColor?: string;
	allDay?: boolean;
	extra_data: any;
}