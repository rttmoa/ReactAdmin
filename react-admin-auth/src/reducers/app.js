import { handleActions } from 'redux-actions'
import { Local } from 'utils/storage'
import {filterRoutes} from 'utils'



/**--- silde开关 ---**/
export const collapsed = handleActions({
    CHANGE_COLLAPSED: state => {
        state = !state
        Local.set('react_collapsed', state)
        return state
    }
}, Local.get('react_collapsed') || false)


/**--- 侧边栏打开的位置 ---**/
export const openKeys = handleActions({
    // // 在数据初始化时(mainjs)添加 tabViews、面包屑、slidebar展开的节点
    SET_OPENKEYS: (state, action) => {
        // console.log("SET_OPENKEYS", action)
        return action.payload;
    }
}, [])

/**--- 面包屑 ---**/
export const breadCrumbs = handleActions({
    // 在数据初始化时(mainjs)添加 tabViews、面包屑、slidebar展开的节点
    ADD_BREADCRUMBS: (state,action) => {
        return action.payload;
    }
},[])

/**--- tabViews ---**/
export const tabViews = handleActions({
    GET_TAB_VIEWS: state => Local.get('tabViews') || [],
    // 在数据初始化时(mainjs)添加 tabViews、面包屑、slidebar展开的节点
    ADD_TAB_VIEWS: (state, action) => {
        let {pathname} = action.payload
        let router = filterRoutes(pathname)
        let route = router.find(route => route.path === pathname)
        if (!route) return state
        let data = state.some( tab => tab.path === pathname) ? state : [...state, {
            path: route.path,
            name: route.name
        }]
        Local.set('reactTagViews', JSON.stringify(data))
        return data
    },
    // 在TabViews.js中
    DEL_TAB_VIEWS: (state, action) => {
    	let index = state.findIndex(tab => tab.path === action.payload.path)
		state.splice(index, 1)
        let data = [...state]
        Local.set('reactTagViews', JSON.stringify(data))
    	return data
    }
}, JSON.parse(Local.get('reactTagViews')) || [])




