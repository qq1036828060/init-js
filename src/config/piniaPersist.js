/**
 * @description pinia 持久化参数配置
 * @param {String} key 存储到持久化的 name
 * @param {Array} paths 需要持久化的 state name
 * @return persist
 * */
const piniaPersistConfig = (key, paths) => {
  const persist = {
    enabled: true,
    strategies: [
			{
				key: key,  //自定义 Key值
				storage: localStorage,  // 选择存储方式
				paths,
			},
		],
  };
  return persist;
};

export default piniaPersistConfig;
