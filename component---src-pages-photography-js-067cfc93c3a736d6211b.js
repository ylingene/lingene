(self.webpackChunklingene=self.webpackChunklingene||[]).push([[110],{8365:function(e,t,r){"use strict";r.d(t,{Z:function(){return u}});var n=r(6033),l=r.n(n),i=r(7294),a=r(7599),c=l().bind({borderBlue:"style--borderBlue--2KvrE",borderGreen:"style--borderGreen--aGofA",borderRed:"style--borderRed--Ky7vy"}),o=function(e){return c({borderBlue:e===a.QB,borderGreen:e===a.zB,borderRed:e===a.or})},s=function(e){var t=e.accentColor,r=e.title,n=e.sectionTitle,l=e.description;return i.createElement("header",{className:"style--header--3LH-S"},i.createElement("div",{className:"style--title--3pXfs"},i.createElement("div",{className:o(t)}),i.createElement("div",null,i.createElement("h3",null,r),i.createElement("h1",null,n))),!!l&&i.createElement("div",{className:"style--description--Q-x-7"},l))};s.defaultProps={description:""};var u=s},9814:function(e,t,r){"use strict";r.d(t,{Z:function(){return m}});var n=r(6033),l=r.n(n),i=r(7294),a=r(7924),c=r(1573),o=r(8365),s=r(7487),u="style--filters--2q2v1",d=l().bind({filterStyle:"style--filter--17_Ie",filterActive:"style--filterActive--3OvIA",filters:u}),f=function(e){var t=e.filterValues,r=e.activeFilter,n=e.onFilterUpdate;return i.createElement("div",{className:u},t.map((function(e){return i.createElement("button",{key:e,className:d({filterStyle:!0,filterActive:e===r}),onClick:function(){return n(e)},onMouseDown:function(e){return e.preventDefault()}},e)})))},m=function(e){var t=e.description,r=e.headerData,n=e.filters,l=void 0===n?[]:n,u=e.fluidImages,d=["all"].concat(l),m=(0,i.useState)(d[0]),v=m[0],p=m[1],y=(0,i.useState)(u),E=y[0],h=y[1];return(0,i.useEffect)((function(){h("all"===v?u:u.filter((function(e){return e.type===v})))}),[v,u]),i.createElement(a.Z,null,i.createElement(s.Z,{title:r.sectionTitle,description:r.description||t}),i.createElement(o.Z,r),l.length>0&&i.createElement(f,{filterValues:d,activeFilter:v,onFilterUpdate:p}),i.createElement(c.Z,{fluidImages:E}))}},3349:function(e,t,r){"use strict";r.r(t);var n=r(7294),l=r(7599),i=r(9814);t.default=function(e){var t=e.data;return n.createElement(i.Z,{description:"Lingene's photography portfolio.",headerData:{accentColor:l.QB,title:"Gallery",sectionTitle:"Photography"},filters:["environment","portrait","landscape"],fluidImages:t.allFile.nodes[0].childrenYaml})}}}]);
//# sourceMappingURL=component---src-pages-photography-js-067cfc93c3a736d6211b.js.map