import {expect} from 'chai';
import francis from '../src/browserClient/francis';

export default () =>{
	describe('francis', () => {
		before((done) => {
			// Delay so that setUp events can prepare
			window.setTimeout(() => {
				document.enchiridion = document.enchiridion || {};
				document.enchiridion.francisMocked = francis({});
				console.log(document.enchiridion.francisMocked);
				done();
			}, 5);
		});

		it('exists', () => {
			const {francisMocked} = document.enchiridion;
			expect(francisMocked).to.be.an('object');
		});

		describe('getFragment', () => {
			it('exists', () => {
				const {getFragment} = document.enchiridion.francisMocked;
				expect(getFragment).to.be.a('function');
			});
		});

		describe('makeFragment', () => {
			it('exists', () => {
				const {makeFragment} = document.enchiridion.francisMocked;
				expect(makeFragment).to.be.a('function');
			});
		});

		describe('addNewDataType', () => {
			it('exists', () => {
				const {addNewDataType} = document.enchiridion.francisMocked;
				expect(addNewDataType).to.be.a('function');
			});
		});

		describe('getAndUsePlugin', () => {
			it('exists', () => {
				const {getAndUsePlugin} = document.enchiridion.francisMocked;
				expect(getAndUsePlugin).to.be.a('function');
			});
		});

		describe('generateDataTypeSelector', () => {
			it('exists', () => {
				const {generateDataTypeSelector} = document.enchiridion.francisMocked;
				expect(generateDataTypeSelector).to.be.a('function');
			});
		});
	});
};
