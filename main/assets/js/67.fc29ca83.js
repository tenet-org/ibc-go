(window.webpackJsonp=window.webpackJsonp||[]).push([[67],{629:function(e,t,c){"use strict";c.r(t);var o=c(1),a=Object(o.a)({},(function(){var e=this,t=e.$createElement,c=e._self._c||t;return c("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[c("h1",{attrs:{id:"building-an-authentication-module"}},[c("a",{staticClass:"header-anchor",attrs:{href:"#building-an-authentication-module"}},[e._v("#")]),e._v(" Building an authentication module")]),e._v(" "),c("h2",{attrs:{id:"deprecation-notice"}},[c("a",{staticClass:"header-anchor",attrs:{href:"#deprecation-notice"}},[e._v("#")]),e._v(" Deprecation Notice")]),e._v(" "),c("p",[c("strong",[e._v("This document is deprecated and will be removed in future releases")]),e._v(".")]),e._v(" "),c("p",{attrs:{synopsis:""}},[e._v("Authentication modules play the role of the "),c("code",[e._v("Base Application")]),e._v(" as described in "),c("a",{attrs:{href:"https://github.com/cosmos/ibc/tree/master/spec/app/ics-030-middleware",target:"_blank",rel:"noopener noreferrer"}},[e._v("ICS-30 IBC Middleware"),c("OutboundLink")],1),e._v(", and enable application developers to perform custom logic when working with the Interchain Accounts controller API.")]),e._v(" "),c("p",[e._v("The controller submodule is used for account registration and packet sending. It executes only logic required of all controllers of interchain accounts. The type of authentication used to manage the interchain accounts remains unspecified. There may exist many different types of authentication which are desirable for different use cases. Thus the purpose of the authentication module is to wrap the controller submodule with custom authentication logic.")]),e._v(" "),c("p",[e._v("In ibc-go, authentication modules are connected to the controller chain via a middleware stack. The controller submodule is implemented as "),c("a",{attrs:{href:"https://github.com/cosmos/ibc/tree/master/spec/app/ics-030-middleware",target:"_blank",rel:"noopener noreferrer"}},[e._v("middleware"),c("OutboundLink")],1),e._v(" and the authentication module is connected to the controller submodule as the base application of the middleware stack. To implement an authentication module, the "),c("code",[e._v("IBCModule")]),e._v(" interface must be fulfilled. By implementing the controller submodule as middleware, any amount of authentication modules can be created and connected to the controller submodule without writing redundant code.")]),e._v(" "),c("p",[e._v("The authentication module must:")]),e._v(" "),c("ul",[c("li",[e._v("Authenticate interchain account owners.")]),e._v(" "),c("li",[e._v("Track the associated interchain account address for an owner.")]),e._v(" "),c("li",[e._v("Send packets on behalf of an owner (after authentication).")])]),e._v(" "),c("blockquote",[c("p",[e._v("Please note that since ibc-go v6 the channel capability is claimed by the controller submodule and therefore it is not required for authentication modules to claim the capability in the "),c("code",[e._v("OnChanOpenInit")]),e._v(" callback. When the authentication module sends packets on the channel created for the associated interchain account it can pass a "),c("code",[e._v("nil")]),e._v(" capability to the legacy function "),c("code",[e._v("SendTx")]),e._v(" of the controller keeper (see section "),c("RouterLink",{attrs:{to:"/apps/interchain-accounts/legacy/keeper-api.html#sendtx"}},[c("code",[e._v("SendTx")])]),e._v(" for more information).")],1)]),e._v(" "),c("h2",{attrs:{id:"ibcmodule-implementation"}},[c("a",{staticClass:"header-anchor",attrs:{href:"#ibcmodule-implementation"}},[e._v("#")]),e._v(" "),c("code",[e._v("IBCModule")]),e._v(" implementation")]),e._v(" "),c("p",[e._v("The following "),c("code",[e._v("IBCModule")]),e._v(" callbacks must be implemented with appropriate custom logic:")]),e._v(" "),c("tm-code-block",{staticClass:"codeblock",attrs:{language:"go",base64:"Ly8gT25DaGFuT3BlbkluaXQgaW1wbGVtZW50cyB0aGUgSUJDTW9kdWxlIGludGVyZmFjZQpmdW5jIChpbSBJQkNNb2R1bGUpIE9uQ2hhbk9wZW5Jbml0KAogIGN0eCBzZGsuQ29udGV4dCwKICBvcmRlciBjaGFubmVsdHlwZXMuT3JkZXIsCiAgY29ubmVjdGlvbkhvcHMgW11zdHJpbmcsCiAgcG9ydElEIHN0cmluZywKICBjaGFubmVsSUQgc3RyaW5nLAogIGNoYW5DYXAgKmNhcGFiaWxpdHl0eXBlcy5DYXBhYmlsaXR5LAogIGNvdW50ZXJwYXJ0eSBjaGFubmVsdHlwZXMuQ291bnRlcnBhcnR5LAogIHZlcnNpb24gc3RyaW5nLAopIChzdHJpbmcsIGVycm9yKSB7CiAgLy8gc2luY2UgaWJjLWdvIHY2IHRoZSBhdXRoZW50aWNhdGlvbiBtb2R1bGUgKm11c3Qgbm90KiBjbGFpbSB0aGUgY2hhbm5lbCBjYXBhYmlsaXR5IG9uIE9uQ2hhbk9wZW5Jbml0CgogIC8vIHBlcmZvcm0gY3VzdG9tIGxvZ2ljCgogIHJldHVybiB2ZXJzaW9uLCBuaWwKfQoKLy8gT25DaGFuT3BlbkFjayBpbXBsZW1lbnRzIHRoZSBJQkNNb2R1bGUgaW50ZXJmYWNlCmZ1bmMgKGltIElCQ01vZHVsZSkgT25DaGFuT3BlbkFjaygKICBjdHggc2RrLkNvbnRleHQsCiAgcG9ydElELAogIGNoYW5uZWxJRCBzdHJpbmcsCiAgY291bnRlcnBhcnR5VmVyc2lvbiBzdHJpbmcsCikgZXJyb3IgewogIC8vIHBlcmZvcm0gY3VzdG9tIGxvZ2ljCgogIHJldHVybiBuaWwKfQoKLy8gT25DaGFuQ2xvc2VDb25maXJtIGltcGxlbWVudHMgdGhlIElCQ01vZHVsZSBpbnRlcmZhY2UKZnVuYyAoaW0gSUJDTW9kdWxlKSBPbkNoYW5DbG9zZUNvbmZpcm0oCiAgY3R4IHNkay5Db250ZXh0LAogIHBvcnRJRCwKICBjaGFubmVsSUQgc3RyaW5nLAopIGVycm9yIHsKICAvLyBwZXJmb3JtIGN1c3RvbSBsb2dpYwoKICByZXR1cm4gbmlsCn0KCi8vIE9uQWNrbm93bGVkZ2VtZW50UGFja2V0IGltcGxlbWVudHMgdGhlIElCQ01vZHVsZSBpbnRlcmZhY2UKZnVuYyAoaW0gSUJDTW9kdWxlKSBPbkFja25vd2xlZGdlbWVudFBhY2tldCgKICBjdHggc2RrLkNvbnRleHQsCiAgcGFja2V0IGNoYW5uZWx0eXBlcy5QYWNrZXQsCiAgYWNrbm93bGVkZ2VtZW50IFtdYnl0ZSwKICByZWxheWVyIHNkay5BY2NBZGRyZXNzLAopIGVycm9yIHsKICAvLyBwZXJmb3JtIGN1c3RvbSBsb2dpYwoKICByZXR1cm4gbmlsCn0KCi8vIE9uVGltZW91dFBhY2tldCBpbXBsZW1lbnRzIHRoZSBJQkNNb2R1bGUgaW50ZXJmYWNlLgpmdW5jIChpbSBJQkNNb2R1bGUpIE9uVGltZW91dFBhY2tldCgKICBjdHggc2RrLkNvbnRleHQsCiAgcGFja2V0IGNoYW5uZWx0eXBlcy5QYWNrZXQsCiAgcmVsYXllciBzZGsuQWNjQWRkcmVzcywKKSBlcnJvciB7CiAgLy8gcGVyZm9ybSBjdXN0b20gbG9naWMKCiAgcmV0dXJuIG5pbAp9Cg=="}}),e._v(" "),c("p",[e._v("The following functions must be defined to fulfill the "),c("code",[e._v("IBCModule")]),e._v(" interface, but they will never be called by the controller submodule so they may error or panic. That is because in Interchain Accounts, the channel handshake is always initiated on the controller chain and packets are always sent to the host chain and never to the controller chain.")]),e._v(" "),c("tm-code-block",{staticClass:"codeblock",attrs:{language:"go",base64:"Ly8gT25DaGFuT3BlblRyeSBpbXBsZW1lbnRzIHRoZSBJQkNNb2R1bGUgaW50ZXJmYWNlCmZ1bmMgKGltIElCQ01vZHVsZSkgT25DaGFuT3BlblRyeSgKICBjdHggc2RrLkNvbnRleHQsCiAgb3JkZXIgY2hhbm5lbHR5cGVzLk9yZGVyLAogIGNvbm5lY3Rpb25Ib3BzIFtdc3RyaW5nLAogIHBvcnRJRCwKICBjaGFubmVsSUQgc3RyaW5nLAogIGNoYW5DYXAgKmNhcGFiaWxpdHl0eXBlcy5DYXBhYmlsaXR5LAogIGNvdW50ZXJwYXJ0eSBjaGFubmVsdHlwZXMuQ291bnRlcnBhcnR5LAogIGNvdW50ZXJwYXJ0eVZlcnNpb24gc3RyaW5nLAopIChzdHJpbmcsIGVycm9yKSB7CiAgcGFuaWMoJnF1b3Q7VU5JTVBMRU1FTlRFRCZxdW90OykKfQoKLy8gT25DaGFuT3BlbkNvbmZpcm0gaW1wbGVtZW50cyB0aGUgSUJDTW9kdWxlIGludGVyZmFjZQpmdW5jIChpbSBJQkNNb2R1bGUpIE9uQ2hhbk9wZW5Db25maXJtKAogIGN0eCBzZGsuQ29udGV4dCwKICBwb3J0SUQsCiAgY2hhbm5lbElEIHN0cmluZywKKSBlcnJvciB7CiAgcGFuaWMoJnF1b3Q7VU5JTVBMRU1FTlRFRCZxdW90OykKfQoKLy8gT25DaGFuQ2xvc2VJbml0IGltcGxlbWVudHMgdGhlIElCQ01vZHVsZSBpbnRlcmZhY2UKZnVuYyAoaW0gSUJDTW9kdWxlKSBPbkNoYW5DbG9zZUluaXQoCiAgY3R4IHNkay5Db250ZXh0LAogIHBvcnRJRCwKICBjaGFubmVsSUQgc3RyaW5nLAopIGVycm9yIHsKICBwYW5pYygmcXVvdDtVTklNUExFTUVOVEVEJnF1b3Q7KQp9CgovLyBPblJlY3ZQYWNrZXQgaW1wbGVtZW50cyB0aGUgSUJDTW9kdWxlIGludGVyZmFjZS4gQSBzdWNjZXNzZnVsIGFja25vd2xlZGdlbWVudAovLyBpcyByZXR1cm5lZCBpZiB0aGUgcGFja2V0IGRhdGEgaXMgc3VjY2VzZnVsbHkgZGVjb2RlZCBhbmQgdGhlIHJlY2VpdmUgYXBwbGljYXRpb24KLy8gbG9naWMgcmV0dXJucyB3aXRob3V0IGVycm9yLgpmdW5jIChpbSBJQkNNb2R1bGUpIE9uUmVjdlBhY2tldCgKICBjdHggc2RrLkNvbnRleHQsCiAgcGFja2V0IGNoYW5uZWx0eXBlcy5QYWNrZXQsCiAgcmVsYXllciBzZGsuQWNjQWRkcmVzcywKKSBpYmNleHBvcnRlZC5BY2tub3dsZWRnZW1lbnQgewogIHBhbmljKCZxdW90O1VOSU1QTEVNRU5URUQmcXVvdDspCn0K"}}),e._v(" "),c("h2",{attrs:{id:"onacknowledgementpacket"}},[c("a",{staticClass:"header-anchor",attrs:{href:"#onacknowledgementpacket"}},[e._v("#")]),e._v(" "),c("code",[e._v("OnAcknowledgementPacket")])]),e._v(" "),c("p",[e._v("Controller chains will be able to access the acknowledgement written into the host chain state once a relayer relays the acknowledgement.\nThe acknowledgement bytes contain either the response of the execution of the message(s) on the host chain or an error. They will be passed to the auth module via the "),c("code",[e._v("OnAcknowledgementPacket")]),e._v(" callback. Auth modules are expected to know how to decode the acknowledgement.")]),e._v(" "),c("p",[e._v("If the controller chain is connected to a host chain using the host module on ibc-go, it may interpret the acknowledgement bytes as follows:")]),e._v(" "),c("p",[e._v("Begin by unmarshaling the acknowledgement into "),c("code",[e._v("sdk.TxMsgData")]),e._v(":")]),e._v(" "),c("tm-code-block",{staticClass:"codeblock",attrs:{language:"go",base64:"dmFyIGFjayBjaGFubmVsdHlwZXMuQWNrbm93bGVkZ2VtZW50CmlmIGVyciA6PSBjaGFubmVsdHlwZXMuU3ViTW9kdWxlQ2RjLlVubWFyc2hhbEpTT04oYWNrbm93bGVkZ2VtZW50LCAmYW1wO2Fjayk7IGVyciAhPSBuaWwgewogIHJldHVybiBlcnIKfQoKdHhNc2dEYXRhIDo9ICZhbXA7c2RrLlR4TXNnRGF0YXt9CmlmIGVyciA6PSBwcm90by5Vbm1hcnNoYWwoYWNrLkdldFJlc3VsdCgpLCB0eE1zZ0RhdGEpOyBlcnIgIT0gbmlsIHsgCiAgcmV0dXJuIGVycgp9Cg=="}}),e._v(" "),c("p",[e._v("If the "),c("code",[e._v("txMsgData.Data")]),e._v(" field is non nil, the host chain is using SDK version <= v0.45.\nThe auth module should interpret the "),c("code",[e._v("txMsgData.Data")]),e._v(" as follows:")]),e._v(" "),c("tm-code-block",{staticClass:"codeblock",attrs:{language:"go",base64:"c3dpdGNoIGxlbih0eE1zZ0RhdGEuRGF0YSkgewpjYXNlIDA6CiAgICAvLyBzZWUgZG9jdW1lbnRhdGlvbiBiZWxvdyBmb3IgU0RLIDAuNDYueCBvciBncmVhdGVyCmRlZmF1bHQ6CiAgZm9yIF8sIG1zZ0RhdGEgOj0gcmFuZ2UgdHhNc2dEYXRhLkRhdGEgewogICAgaWYgZXJyIDo9IGhhbmRsZXIobXNnRGF0YSk7IGVyciAhPSBuaWwgewogICAgICByZXR1cm4gZXJyCiAgICB9CiAgfQouLi4KfSAgICAgICAgICAgIAo="}}),e._v(" "),c("p",[e._v("A handler will be needed to interpret what actions to perform based on the message type sent.\nA router could be used, or more simply a switch statement.")]),e._v(" "),c("tm-code-block",{staticClass:"codeblock",attrs:{language:"go",base64:"ZnVuYyBoYW5kbGVyKG1zZ0RhdGEgc2RrLk1zZ0RhdGEpIGVycm9yIHsKc3dpdGNoIG1zZ0RhdGEuTXNnVHlwZSB7CmNhc2Ugc2RrLk1zZ1R5cGVVUkwoJmFtcDtiYW5rdHlwZXMuTXNnU2VuZHt9KToKICBtc2dSZXNwb25zZSA6PSAmYW1wO2Jhbmt0eXBlcy5Nc2dTZW5kUmVzcG9uc2V7fQogIGlmIGVyciA6PSBwcm90by5Vbm1hcnNoYWwobXNnRGF0YS5EYXRhLCBtc2dSZXNwb25zZX07IGVyciAhPSBuaWwgewogICAgcmV0dXJuIGVycgogIH0KCiAgaGFuZGxlQmFua1NlbmRNc2cobXNnUmVzcG9uc2UpCgpjYXNlIHNkay5Nc2dUeXBlVVJMKCZhbXA7c3Rha2luZ3R5cGVzLk1zZ0RlbGVnYXRle30pOgogIG1zZ1Jlc3BvbnNlIDo9ICZhbXA7c3Rha2luZ3R5cGVzLk1zZ0RlbGVnYXRlUmVzcG9uc2V7fQogIGlmIGVyciA6PSBwcm90by5Vbm1hcnNoYWwobXNnRGF0YS5EYXRhLCBtc2dSZXNwb25zZX07IGVyciAhPSBuaWwgewogICAgcmV0dXJuIGVycgogIH0KCiAgaGFuZGxlU3Rha2luZ0RlbGVnYXRlTXNnKG1zZ1Jlc3BvbnNlKQoKY2FzZSBzZGsuTXNnVHlwZVVSTCgmYW1wO3RyYW5zZmVydHlwZXMuTXNnVHJhbnNmZXJ7fSk6CiAgbXNnUmVzcG9uc2UgOj0gJmFtcDt0cmFuc2ZlcnR5cGVzLk1zZ1RyYW5zZmVyUmVzcG9uc2V7fQogIGlmIGVyciA6PSBwcm90by5Vbm1hcnNoYWwobXNnRGF0YS5EYXRhLCBtc2dSZXNwb25zZX07IGVyciAhPSBuaWwgewogICAgICByZXR1cm4gZXJyCiAgfQoKICBoYW5kbGVJQkNUcmFuc2Zlck1zZyhtc2dSZXNwb25zZSkKIApkZWZhdWx0OgogIHJldHVybgp9Cg=="}}),e._v(" "),c("p",[e._v("If the "),c("code",[e._v("txMsgData.Data")]),e._v(" is empty, the host chain is using SDK version > v0.45.\nThe auth module should interpret the "),c("code",[e._v("txMsgData.Responses")]),e._v(" as follows:")]),e._v(" "),c("tm-code-block",{staticClass:"codeblock",attrs:{language:"go",base64:"Li4uCi8vIHN3aXRjaCBzdGF0ZW1lbnQgZnJvbSBhYm92ZQpjYXNlIDA6CiAgZm9yIF8sIGFueSA6PSByYW5nZSB0eE1zZ0RhdGEuTXNnUmVzcG9uc2VzIHsKICAgIGlmIGVyciA6PSBoYW5kbGVBbnkoYW55KTsgZXJyICE9IG5pbCB7CiAgICAgIHJldHVybiBlcnIKICAgIH0KICB9Cn0K"}}),e._v(" "),c("p",[e._v("A handler will be needed to interpret what actions to perform based on the type URL of the Any.\nA router could be used, or more simply a switch statement.\nIt may be possible to deduplicate logic between "),c("code",[e._v("handler")]),e._v(" and "),c("code",[e._v("handleAny")]),e._v(".")]),e._v(" "),c("tm-code-block",{staticClass:"codeblock",attrs:{language:"go",base64:"ZnVuYyBoYW5kbGVBbnkoYW55ICpjb2RlY3R5cGVzLkFueSkgZXJyb3Igewpzd2l0Y2ggYW55LlR5cGVVUkwgewpjYXNlIGJhbmt0eXBlcy5Nc2dTZW5kOgogIG1zZ1Jlc3BvbnNlLCBlcnIgOj0gdW5wYWNrQmFua01zZ1NlbmRSZXNwb25zZShhbnkpCiAgaWYgZXJyICE9IG5pbCB7CiAgICByZXR1cm4gZXJyCiAgfQoKICBoYW5kbGVCYW5rU2VuZE1zZyhtc2dSZXNwb25zZSkKCmNhc2Ugc3Rha2luZ3R5cGVzLk1zZ0RlbGVnYXRlOgogIG1zZ1Jlc3BvbnNlLCBlcnIgOj0gdW5wYWNrU3Rha2luZ0RlbGVnYXRlUmVzcG9uc2UoYW55KQogIGlmIGVyciAhPSBuaWwgewogICAgcmV0dXJuIGVycgogIH0KCiAgaGFuZGxlU3Rha2luZ0RlbGVnYXRlTXNnKG1zZ1Jlc3BvbnNlKQoKICBjYXNlIHRyYW5zZmVydHlwZXMuTXNnVHJhbnNmZXI6CiAgbXNnUmVzcG9uc2UsIGVyciA6PSB1bnBhY2tJQkNUcmFuc2Zlck1zZ1Jlc3BvbnNlKGFueSkKICBpZiBlcnIgIT0gbmlsIHsKICAgIHJldHVybiBlcnIKICB9CgogIGhhbmRsZUlCQ1RyYW5zZmVyTXNnKG1zZ1Jlc3BvbnNlKQogCmRlZmF1bHQ6CiAgICByZXR1cm4KfQo="}}),e._v(" "),c("h2",{attrs:{id:"integration-into-app-go-file"}},[c("a",{staticClass:"header-anchor",attrs:{href:"#integration-into-app-go-file"}},[e._v("#")]),e._v(" Integration into "),c("code",[e._v("app.go")]),e._v(" file")]),e._v(" "),c("p",[e._v("To integrate the authentication module into your chain, please follow the steps outlined in "),c("RouterLink",{attrs:{to:"/apps/interchain-accounts/legacy/integration.html#example-integration"}},[c("code",[e._v("app.go")]),e._v(" integration")]),e._v(".")],1)],1)}),[],!1,null,null,null);t.default=a.exports}}]);