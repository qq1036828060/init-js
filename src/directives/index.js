import auth from "./modules/auth";
import copy from "./modules/copy";
import draggable from "./modules/draggable";

const directivesList = {
  auth,
  copy,
  draggable,
};

const directives = {
  install: function (app) {
    Object.keys(directivesList).forEach(key => {
      app.directive(key, directivesList[key]);
    });
  }
};

export default directives;
