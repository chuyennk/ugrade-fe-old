import axios from 'axios'
export async function loggingIn (context, {usr, pwd}) {
    try{
      const res = await axios.post('http://localhost:5000/user/login', {usr, pwd})
      console.log(res.data)
      context.commit('setLoginInfo', res.data)
    //   return res.data
    }
    catch (err){
      console.log(err)
    }
  }

export async function fuzzySearch(context, strSearch) {
    try{
      const res = await axios.get('http://localhost:5000/cust/fuzzysearch/' + strSearch )
      const searchResult = {
        strSearch: strSearch,
        message: 'OK',
        results: res.data?res.data:[],
      }
      context.commit('setSearchResult', searchResult)
    //   return searchResult
    }
    catch(e){
      const searchResult = {
        strSearch: strSearch,
        message: e.message,
        results: [] ,
      }
      context.commit('setSearchResult', searchResult)
    //   return searchResult
    }
}

export async function getCustByID(context, custID){
  try{
    const res = await axios.get('http://localhost:5000/cust/getcust/' + custID)
    const custInfo = {...res.data}
    custInfo['message'] = 'OK'
    context.commit('setCustInfo', custInfo)
  }catch(e){
    const custInfo = {message: e.message}
    context.commit('setCustInfo', custInfo)
  }
}
  
export async function populateFssData(context, cust){
    try{
        const res = await axios.get('http://localhost:5000/fss/getfssdata/' + cust.custID + '/' + cust.fssLevelType)
        context.commit('setFssData', res.data)
      // return {fssData}
    }catch(e){
      this.setFssData({
        fssInfo: {},
        fssHeaders: [],
        fssItems: []
      })
    }
}

export async function  saveFssData(fssData){
    try{
      await axios.post('http://localhost:5000/fss/savefssdata', fssData)
      return {message: 'OK'}
    }catch(e){
      return {message: e.message}
    }
}


export async function getScorecard(context, scID){
  try{
    const res = await axios.get('http://localhost:5000/sc/getscorecard/' + scID)
    const scData = {...res.data}
    if (scData.message == 'OK' ) context.commit('setScData', scData)
    return scData
  }catch(e){
    const scData = {message: e.message}
    return scData
  }
}
  
export async function  saveScorecard(context, scData){
  try{
    await axios.post('http://localhost:5000/sc/savescorecard', scData)
    context.commit('setScData', scData)
    return {message: 'OK'}
  }catch(e){
    return {message: e.message}
  }
}
