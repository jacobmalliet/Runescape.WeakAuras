export class TimeSpan {
	public milliseconds: number;

	private constructor(milliseconds: number) {
		this.milliseconds = milliseconds;
	}

	public static fromMs(milliseconds: number) {
		return new TimeSpan(milliseconds);
	}

	public static fromSeconds(seconds: number) {
		return TimeSpan.fromMs(seconds * 1000);
	}

	public static fromMinutes(minutes: number) {
		return TimeSpan.fromSeconds(minutes * 60);
	}

	get totalMilliseconds() {
		return this.milliseconds;
	}
	
	// Outputs the time in a human readable format like 1h or 30m, etc.
	public toString() : string {
		let totalSeconds = this.milliseconds / 1000;
		let totalMinutes = totalSeconds / 60;
		let totalHours = totalMinutes / 60;
		let totalDays = totalHours / 24;
		
		if (totalDays >= 1) {
			return `${Math.floor(totalDays)}d`;
		}
		if (totalHours >= 1) {
			return `${Math.floor(totalHours)}h`;
		}
		if (totalMinutes >= 1) {
			return `${Math.floor(totalMinutes)}m`;
		}
		if (totalSeconds >= 0) {
			return `${Math.floor(totalSeconds)}s`;
		}
		
		return '';
	}
}
