import { createStore, applyMiddleware } from 'redux';
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk';
import reducer from '~/src/reducer.js';

// 永続化の設定
const persistConfig = {
    key: 'root', // Storageに保存されるキー名を指定する
    storage, // 保存先としてlocalStorageがここで設定される
    whitelist: ['profile','skill','friends','friend_detail','entry','user_id','token', 'user_photo'] // Stateは`profile`のみStorageに保存する
    // blacklist: ['visibilityFilter'] // `visibilityFilter`は保存しない
}
// 永続化設定されたReducerとして定義
const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(
    persistedReducer,
    applyMiddleware(thunk)
);

export const persistor = persistStore(store)
export default store
store.subscribe(() =>
    console.log(store.getState())
)
