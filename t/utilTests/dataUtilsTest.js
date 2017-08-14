import {expect} from 'chai';

export default () =>{
	describe('dataUtils', () => {
		describe('getParamsFromURL', () => {
			before((done) => {
				// Delay so that setUp events can prepare
				window.setTimeout(() => {
					done();
				}, 5);
			});

			it('exists', () => {
				const {getParamsFromURL} = document.enchiridion.libs.dataUtils;
				expect(getParamsFromURL).to.be.a('function');
			});

			it('extracts data', () => {
				const {getParamsFromURL} = document.enchiridion.libs.dataUtils,
					urlString = '?fragment=asdf&lang=eng',
					expected = {
						fragment: 'asdf',
						lang: 'eng',
					},
					actual = getParamsFromURL(urlString);
				expect(actual).to.eql(expected);
			});

			it('handles an empty search value', () => {
				const {getParamsFromURL} = document.enchiridion.libs.dataUtils,
					urlString = '',
					expected = { },
					actual = getParamsFromURL(urlString);
				expect(actual).to.eql(expected);
			});

			it('handles a preceeding question mark', () => {
				const {getParamsFromURL} = document.enchiridion.libs.dataUtils,
					urlString = '?',
					expected = { },
					actual = getParamsFromURL(urlString);
				expect(actual).to.eql(expected);
			});
		});


		describe('dataTypeMatchesConfig', () => {
			before((done) => {
				// Delay so that setUp events can prepare
				window.setTimeout(() => {
					done();
				}, 5);
			});

			it('exists', () => {
				const {dataTypeMatchesConfig} = document.enchiridion.libs.dataUtils;
				expect(dataTypeMatchesConfig).to.be.a('function');
			});

			it('matches the single given language', () => {
				const {dataTypeMatchesConfig} = document.enchiridion.libs.dataUtils,
					dataType = {language: ['eng']},
					listName = 'language',
					configList = ['eng'],
					actual = dataTypeMatchesConfig(dataType, listName, configList);
				expect(actual).to.be.true;
			});

			it('matches an accepted language', () => {
				const {dataTypeMatchesConfig} = document.enchiridion.libs.dataUtils,
					dataType = {language: ['pcm', 'eng']},
					listName = 'language',
					configList = ['eng'],
					actual = dataTypeMatchesConfig(dataType, listName, configList);
				expect(actual).to.be.true;
			});

			it('multiple matches', () => {
				const {dataTypeMatchesConfig} = document.enchiridion.libs.dataUtils,
					dataType = {language: ['pcm', 'eng']},
					listName = 'language',
					configList = ['pcm', 'eng'],
					actual = dataTypeMatchesConfig(dataType, listName, configList);
				expect(actual).to.be.true;
			});

			it('No matches', () => {
				const {dataTypeMatchesConfig} = document.enchiridion.libs.dataUtils,
					dataType = {language: ['pcm']},
					listName = 'language',
					configList = ['eng'],
					actual = dataTypeMatchesConfig(dataType, listName, configList);
				expect(actual).to.be.false;
			});
		});

		describe('selectDataType', () => {
			before((done) => {
				// Delay so that setUp events can prepare
				window.setTimeout(() => {
					done();
				}, 5);
			});

			it('exists', () => {
				const {selectDataType} = document.enchiridion.libs.dataUtils;
				expect(selectDataType).to.be.a('function');
			});

			it('returns empty list when no languages match', () => {
				const {selectDataType} = document.enchiridion.libs.dataUtils,
					fragment = {data: [{
						language: ['pcm'],
						format: 'text/plain',
					}]},
					config = {
						languages: ['eng'],
						formats: ['text/plain'],
					},
					actual = selectDataType(fragment, config),
					expected = [];
				expect(actual).to.be.an('array');
				expect(actual).to.be.eql(expected);
			});

			it('returns only matching languages', () => {
				const {selectDataType} = document.enchiridion.libs.dataUtils,
					fragment = {data: [{
						language: ['eng'],
						format: 'text/plain',
					}, {
						language: ['pcm'],
						format: 'text/plain',
					}]},
					config = {
						languages: ['eng'],
						formats: ['text/plain'],
					},
					actual = selectDataType(fragment, config),
					expected = [{
						language: ['eng'],
						format: 'text/plain',
					}];
				expect(actual).to.be.an('array');
				expect(actual).to.be.eql(expected);
			});

			it('returns all matching languges', () => {
				const {selectDataType} = document.enchiridion.libs.dataUtils,
					fragment = {data: [{
						language: ['eng'],
						format: 'text/plain',
					}, {
						language: ['pcm'],
						format: 'text/plain',
					}]},
					config = {
						languages: ['eng', 'pcm'],
						formats: ['text/plain'],
					},
					actual = selectDataType(fragment, config),
					expected = [{
						language: ['eng'],
						format: 'text/plain',
					}, {
						language: ['pcm'],
						format: 'text/plain',
					}];
				expect(actual).to.be.an('array');
				expect(actual).to.be.eql(expected);
			});

			it('filters by formats if there are multiple valid languages ', () => {
				const {selectDataType} = document.enchiridion.libs.dataUtils,
					fragment = {data: [{
						language: ['eng'],
						format: 'text/plain',
					}, {
						language: ['pcm'],
						format: 'text/markdown',
					}]},
					config = {
						languages: ['eng', 'pcm'],
						formats: ['text/markdown'],
					},
					actual = selectDataType(fragment, config),
					expected = [{
						language: ['pcm'],
						format: 'text/markdown',
					}];
				expect(actual).to.be.an('array');
				expect(actual).to.be.eql(expected);
			});

			it('returns all valid languages when format filter removes all', () => {
				const {selectDataType} = document.enchiridion.libs.dataUtils,
					fragment = {data: [{
						language: ['eng'],
						format: 'text/plain',
					}, {
						language: ['pcm'],
						format: 'text/plain',
					}]},
					config = {
						languages: ['eng', 'pcm'],
						formats: ['text/markdown'],
					},
					actual = selectDataType(fragment, config),
					expected = [{
						language: ['eng'],
						format: 'text/plain',
					}, {
						language: ['pcm'],
						format: 'text/plain',
					}];
				expect(actual).to.be.an('array');
				expect(actual).to.be.eql(expected);
			});

			it('returns empty array when the fragment has no dataTypes', () => {
				const {selectDataType} = document.enchiridion.libs.dataUtils,
					fragment = {data: []},
					config = {
						languages: ['eng'],
						formats: ['text/plain'],
					},
					actual = selectDataType(fragment, config),
					expected = [];
				expect(actual).to.be.an('array');
				expect(actual).to.be.eql(expected);
			});
		});

		describe('extractContent', () => {
			before((done) => {
				// Delay so that setUp events can prepare
				window.setTimeout(() => {
					done();
				}, 5);
			});

			it('exists', () => {
				const {extractContent} = document.enchiridion.libs.dataUtils;
				expect(extractContent).to.be.a('function');
			});
		});

		describe('elementsToList', () => {
			before((done) => {
				// Delay so that setUp events can prepare
				window.setTimeout(() => {
					done();
				}, 5);
			});

			it('exists', () => {
				const {elementsToList} = document.enchiridion.libs.dataUtils;
				expect(elementsToList).to.be.a('function');
			});
		});
	});
};
