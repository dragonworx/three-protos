import * as Comlink from 'comlink';

export class MyClass {
	logSomething() {
		console.log('something!');
	}
}

Comlink.expose(MyClass);
