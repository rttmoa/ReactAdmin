import './index.html';
import './index.less';
import dva from 'dva';
import { browserHistory } from 'dva/router'; //--->  全局路由地址
import router from './router';  //--->  路由

import home from './models/home';  //--->  dvajs状态管理
import orders from './models/orders';
import storage from './models/storage';
import manage from './models/manage';
import systemUser from './models/systemUser';
import customers from './models/customers';
import products from './models/products';
import suppliers from './models/suppliers';
import settlement from './models/settlement';
import resource from './models/resource';
import customerBills from './models/customerBills';
import supplierBills from './models/supplierBills';

// 1. Initialize
const app = dva({
    history: browserHistory,
    onError(err) {
		// 在这里进行错误处理
		console.log("indexjs-dvaError", err);
	},
});

// 2. Plugins
//app.use({});

// 3. Model
app.model(home);
app.model(orders);
// app.model(require('./models/stocks'));
app.model(storage);
// app.model(require('./models/funds'));
app.model(manage);
app.model(systemUser);
app.model(customers);
app.model(products);
app.model(suppliers);
app.model(settlement);
app.model(resource);
app.model(customerBills);
app.model(supplierBills);

// 4. Router
app.router(router);

// 5. Start
app.start('#root');
