webpackJsonp([0],{274:function(t,e,n){"use strict";function u(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(42),a=u(i),l=n(70),r=u(l),o=n(37),d=u(o),s=n(38),f=u(s),c=n(39),p=u(c),h=n(40),_=u(h),v=n(41),y=u(v),m=n(0),k=u(m),E=(n(72),n(73)),b=(u(E),n(71)),g=n(43),C=n(276),L=u(C),M=(n(125),function(t){function e(){return(0,f.default)(this,e),(0,_.default)(this,(e.__proto__||(0,d.default)(e)).apply(this,arguments))}return(0,y.default)(e,t),(0,p.default)(e,[{key:"render",value:function(){return k.default.createElement("div",null,k.default.createElement("h1",{onClick:this.getList.bind(this)},"todo-list"),k.default.createElement("input",{type:"text",ref:"todo"}),k.default.createElement("button",{onClick:this.submit.bind(this)},"提交"),k.default.createElement(L.default,null))}},{key:"getList",value:function(){this.props.dispatch({type:"/get_todo"})}},{key:"submit",value:function(){this.props.dispatch({type:"/add_todo",data:this.props.todoList,name:this.refs.todo.value})}}],[{key:"getInitialProps",value:function(){function t(t){return e.apply(this,arguments)}var e=(0,r.default)(a.default.mark(function t(e){var n=e.store;e.isServer;return a.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:n.dispatch({type:"/get_todo"});case 1:case"end":return t.stop()}},t,this)}));return t}()}]),e}(k.default.Component));e.default=(0,b.withReduxSaga)((0,g.connect)(function(t){return t})(M))},276:function(t,e,n){"use strict";function u(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(37),a=u(i),l=n(38),r=u(l),o=n(39),d=u(o),s=n(40),f=u(s),c=n(41),p=u(c),h=n(0),_=u(h),v=n(43),y=n(277),m=u(y),k=function(t){function e(){return(0,r.default)(this,e),(0,f.default)(this,(e.__proto__||(0,a.default)(e)).apply(this,arguments))}return(0,p.default)(e,t),(0,d.default)(e,[{key:"finish",value:function(t){this.props.dispatch({type:"/finish_todo",data:this.props.todoList,id:t})}},{key:"delete",value:function(t){this.props.dispatch({type:"/del_todo",data:this.props.todoList,id:t})}},{key:"render",value:function(){var t=this,e=this.props.todoList;return!1==!!e||0===e.length?null:_.default.createElement("ul",null,e.map(function(e){return _.default.createElement(m.default,{key:e.id,data:e,finish:t.finish.bind(t,e.id),delete:t.delete.bind(t,e.id)})}))}}]),e}(_.default.Component);e.default=(0,v.connect)(function(t){return t})(k)},277:function(t,e,n){"use strict";function u(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(37),a=u(i),l=n(38),r=u(l),o=n(39),d=u(o),s=n(40),f=u(s),c=n(41),p=u(c),h=n(0),_=u(h),v=n(125),y=function(t){function e(){return(0,r.default)(this,e),(0,f.default)(this,(e.__proto__||(0,a.default)(e)).apply(this,arguments))}return(0,p.default)(e,t),(0,d.default)(e,[{key:"render",value:function(){var t=this.props.data,e=t.finish?{textDecoration:"line-through"}:{};return _.default.createElement("li",null,_.default.createElement("span",{style:e,onClick:this.props.finish},t.name),"      ",_.default.createElement(v.Link,{to:"/detail/"+t.id},_.default.createElement("span",null,"查看")),"    ",_.default.createElement("a",{href:"javascript:;",onClick:this.props.delete},"删除"))}}]),e}(_.default.Component);e.default=y}});