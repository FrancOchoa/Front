export interface Customer {
	id?: number;
	type?: string;
	name?: string;
	contact?: string;
	phone?: string;
	email?: string;
	address?: string;
	ruc?: string;
	user_id?: any;
    last_comment?: string;
	extra_data?: Array<any>;
    comments_today?: Array<Comment>;
    thumbnails: Array<any>;
}
