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
}
