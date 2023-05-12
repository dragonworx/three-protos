import EventEmitter from 'eventemitter3';

export class DropZone extends EventEmitter<
	'enter' | 'over' | 'leave' | 'drop' | 'files' | 'end' | 'cancel'
> {
	public isEnabled: boolean;
	public isDragOver: boolean;
	private counter = 0;

	public static isDragOver = false;
	public static hasInit = false;

	public static init() {
		if (this.hasInit) {
			return;
		}

		function preventDefaults(e: Event) {
			e.preventDefault();
			e.stopPropagation();
		}

		['dragenter', 'dragover', 'dragleave', 'drop', 'dragend'].forEach((eventName) => {
			document.body.addEventListener(eventName, preventDefaults, false);
		});

		this.hasInit = true;
	}

	constructor(container?: HTMLElement) {
		super();

		DropZone.init();

		this.isEnabled = true;
		this.isDragOver = false;

		if (container) {
			this.bind(container);
		}
	}

	public bind(container: HTMLElement) {
		container.addEventListener('dragenter', this.onDragEnter);
		container.addEventListener('dragover', this.onDragOver);
		container.addEventListener('dragleave', this.onDragLeave);
		container.addEventListener('drop', this.onDrop);
		container.addEventListener('dragend', this.onDragEnd);

		return this;
	}

	public unbind(container: HTMLElement) {
		container.removeEventListener('dragenter', this.onDragEnter);
		container.removeEventListener('dragover', this.onDragOver);
		container.removeEventListener('dragleave', this.onDragLeave);
		container.removeEventListener('drop', this.onDrop);
		container.removeEventListener('dragend', this.onDragEnd);

		return this;
	}

	public onDragOver = (e: DragEvent) => {
		const { dataTransfer } = e;

		if (dataTransfer) {
			this.emit('over', e);
		}
	};

	public onDragEnter = (e: DragEvent) => {
		const { dataTransfer } = e;

		this.counter++;

		if (dataTransfer && this.counter === 1) {
			const d = dataTransfer.getData('application/x-moz-file');

			dataTransfer.setData('application/x-moz-file', d);

			dataTransfer.dropEffect = 'none';
			dataTransfer.effectAllowed = dataTransfer.dropEffect;

			this.isDragOver = true;

			this.emit('enter', e);
		}

		DropZone.isDragOver = true;
	};

	public onDragLeave = (e: DragEvent) => {
		const { dataTransfer } = e;

		this.counter--;

		if (dataTransfer && this.counter === 0) {
			this.isDragOver = false;

			this.emit('leave', e);
		}
	};

	public onDrop = (e: DragEvent) => {
		const { dataTransfer } = e;

		this.emit('drop', e);

		if (dataTransfer) {
			const files = dataTransfer.files;

			this.counter = 0;
			this.isDragOver = false;

			if (files.length >= 1 && this.isEnabled) {
				this.emit('files', files);
			}
		}
	};

	public onDragEnd = (e: DragEvent) => {
		const { dataTransfer } = e;

		this.emit('end', e);

		if (dataTransfer && dataTransfer.dropEffect === 'none') {
			this.emit('cancel', e);
		}
	};
}
