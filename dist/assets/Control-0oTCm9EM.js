const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Panel-3yiV9Uu-.js","assets/index-Lf7PwzoM.js","assets/index-DlUlXIqN.css"])))=>i.map(i=>d[i]);
import{r as x,_ as j,j as e,L as g,R as f}from"./index-Lf7PwzoM.js";console.log("entered control");//! we should probably delete "user id" property
const b=x.lazy(()=>j(()=>import("./Panel-3yiV9Uu-.js"),__vite__mapDeps([0,1,2]))),_=()=>{const[d,p]=x.useState({array:[]});x.useState({});const u=(t,i,o)=>{const n=t[o].part;let r=i-1;for(let l=i;l<o;l++)if(t[l].part<n){r++;const h=t[r];t[r]=t[l],t[l]=h}const s=t[r+1];return t[r+1]=t[o],t[o]=s,r+1},a=(t,i,o)=>{if(console.log("hello"),i<o){const n=u(t,i,o);a(t,i,n-1),a(t,n+1,o)}},c=(t,i)=>{const o=d.array;console.log(o[0][t]);let n=[{part:0,index:0}];const r=n.length;for(let s=0;s<r;s++){const l=o[s][t];console.log(l),n[s]={part:l,index:s}}console.log(n),a(n,0,n.length-1),console.log("bip",n);for(let s=0;s<=n.length-1;s++){let l;i?l=n.length-1-s:l=s,n[l]=d.array[n[s].index]}console.log("bip",n),p({array:n,isFetching:!1})},m=t=>{t.target.value=="v"&&(t.target.value="^",c(t.target.id,!0))};return console.log("kms",d),e.jsxs(e.Fragment,{children:[e.jsx("div",{hidden:!0,id:"",className:"overlay",children:e.jsx(b,{})}),e.jsxs("table",{className:"table",border:1,children:[e.jsx("thead",{className:"headers",children:e.jsxs("tr",{children:[e.jsxs("th",{children:["Name ",e.jsx("input",{type:"button",id:"name",onClick:t=>c(t.target.id,!1)})]}),e.jsxs("th",{children:["User ID ",e.jsx("input",{type:"button",id:"userID",onClick:t=>c(t.target.id,!1)})]}),e.jsxs("th",{children:["Email ",e.jsx("input",{type:"button",id:"email",onClick:t=>c(t.target.id,!1)})]}),e.jsxs("th",{children:["Member Type ",e.jsx("input",{type:"button",id:"membertype",onClick:t=>c(t.target.id,!1)})]}),e.jsxs("th",{children:["Total Points ",e.jsx("input",{type:"button",id:"totalpoints",onClick:t=>m(t)})]})]})}),e.jsx("tbody",{children:d.isFetching==null?e.jsx(g,{}):d.array.map((t,i)=>(console.log("should be going?"),e.jsx(f.Fragment,{children:e.jsxs("tr",{children:[e.jsx("td",{children:t.name}),e.jsx("td",{children:t.userID}),e.jsx("td",{children:t.email}),e.jsx("td",{children:t.membertype}),e.jsx("td",{children:t.totalpoints})]})},i)))})]})]})};export{_ as default};
