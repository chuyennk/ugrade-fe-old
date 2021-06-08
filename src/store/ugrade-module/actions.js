import axios from 'axios'
export async function loggingIn(context, { usr, pwd }) {
	try {
		const res = await axios.post('http://localhost:5000/user/login', { usr, pwd })
		// console.log(res.data)
		context.commit('setLoginInfo', res.data.params)
		// this.loginInfo = res.data
		//   return res.data
	} catch (err) {
		console.log(err)
	}
}

export async function fuzzySearch(context, strSearch) {
	try {
		const res = await axios.get('http://localhost:5000/cust/fuzzysearch/' + strSearch)
		const searchResult = {
			strSearch: strSearch,
			message: res.data.message,
			results: res.data.params ? res.data.params : [],
		}
		context.commit('setSearchResult', searchResult)
		//   return searchResult
	} catch (e) {
		const searchResult = {
			strSearch: strSearch,
			message: e.message,
			results: [],
		}
		context.commit('setSearchResult', searchResult)
		//   return searchResult
	}
}

export async function getCustByID(context, custID) {
	try {
		const res = await axios.get('http://localhost:5000/cust/getcust/' + custID)
		const custInfo = { ...res.data }
		if (custInfo.message == 'OK') {
			context.commit('setCustInfo', custInfo.params)
		} else {
			context.commit('setCustInfo', [])
		}
	} catch (e) {
		return { message: e.message, params: 'error' }
	}
}

export async function populateFssData(context, cust) {
	try {
		const res = await axios.get('http://localhost:5000/fss/getfssdata/' + cust.custID + '/' + cust.fssLevelType)
		context.commit('setFssData', res.data)
		// return {fssData}
	} catch (e) {
		this.setFssData({
			fssInfo: {},
			fssHeaders: [],
			fssItems: [],
		})
	}
}

export async function saveFssData(context, fssData) {
	try {
		await axios.post('http://localhost:5000/fss/savefssdata', fssData)
		return { message: 'OK' }
	} catch (e) {
		return { message: e.message, params: 'error' }
	}
}

// Scorecard store actions
export async function getActScModels(context) {
	try {
		const res = await axios.get('http://localhost:5000/sc/getActScModels')
		return res.data
	} catch (e) {
		return { message: e.message, params: 'error' }
	}
}

export async function getScorecardList(context, custID) {
	try {
		const res = await axios.get('http://localhost:5000/sc/getscorecardlist/' + custID)
		if (res.data.message == 'OK') context.commit('setScList', res.data.params)
		else context.commit('setScList', [])

		return res.data
	} catch (e) {
		return { message: e.message, params: 'error' }
	}
}

export async function getScorecard(context, scID) {
	try {
		const res = await axios.get('http://localhost:5000/sc/getscorecard/' + scID)
		if (res.data.message == 'OK') context.commit('setScData', res.data.params)
		return res.data
	} catch (e) {
		return { message: e.message, params: 'error' }
	}
}

export async function createNewScorecard(context, scNewData) {
	try {
		const res = await axios.post('http://localhost:5000/sc/createNewScorecard', scNewData)
		context.commit('setScData', res.data.params)
		return res.data
	} catch (e) {
		return { message: e.message, params: 'error' }
	}
}

export async function saveScorecard(context, scData) {
	try {
		const res = await axios.post('http://localhost:5000/sc/savescorecard', scData)
		context.commit('setScData', res.data.params)
		return res.data
	} catch (e) {
		return { message: e.message, params: 'error' }
	}
}

export async function saveScTemplate(context, scData) {
	try {
		res = await axios.post('http://localhost:5000/sc/savetemplate', scData)
		context.commit('setScData', res.data)
		return res.data
	} catch (e) {
		return { message: e.message, params: 'error' }
	}
}

export async function getParams(context, paramname) {
	try {
		const res = await axios.get('http://localhost:5000/params/' + paramname)
		return res.data
	} catch (e) {
		return { message: e.message, params: 'error' }
	}
}
