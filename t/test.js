import chai, {should} from 'chai';
should();
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

// import dataUtilsTest from './utilTests/dataUtilsTest.js';
import francisTest from './francisTest.js';

	console.log('The tests begin');
	// dataUtilsTest();
	francisTest();
