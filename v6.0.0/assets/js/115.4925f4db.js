(window.webpackJsonp=window.webpackJsonp||[]).push([[115],{677:function(e,t,o){"use strict";o.r(t);var a=o(0),n=Object(a.a)({},(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[o("h1",{attrs:{id:"overview"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#overview"}},[e._v("#")]),e._v(" Overview")]),e._v(" "),o("p",{attrs:{synopsis:""}},[e._v("Learn about what the Fee Middleware module is, and how to build custom modules that utilize the Fee Middleware functionality")]),e._v(" "),o("h2",{attrs:{id:"what-is-the-fee-middleware-module"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#what-is-the-fee-middleware-module"}},[e._v("#")]),e._v(" What is the Fee Middleware module?")]),e._v(" "),o("p",[e._v("IBC does not depend on relayer operators for transaction verification. However, the relayer infrastructure ensures liveness of the Interchain network — operators listen for packets sent through channels opened between chains, and perform the vital service of ferrying these packets (and proof of the transaction on the sending chain/receipt on the receiving chain) to the clients on each side of the channel.")]),e._v(" "),o("p",[e._v("Though relaying is permissionless and completely decentralized and accessible, it does come with operational costs. Running full nodes to query transaction proofs and paying for transaction fees associated with IBC packets are two of the primary cost burdens which have driven the overall discussion on "),o("strong",[e._v("a general, in-protocol incentivization mechanism for relayers")]),e._v(".")]),e._v(" "),o("p",[e._v("Initially, a "),o("a",{attrs:{href:"https://github.com/cosmos/ibc/pull/577/files",target:"_blank",rel:"noopener noreferrer"}},[e._v("simple proposal"),o("OutboundLink")],1),e._v(" was created to incentivize relaying on ICS20 token transfers on the destination chain. However, the proposal was specific to ICS20 token transfers and would have to be reimplemented in this format on every other IBC application module.")]),e._v(" "),o("p",[e._v("After much discussion, the proposal was expanded to a "),o("a",{attrs:{href:"https://github.com/cosmos/ibc/tree/master/spec/app/ics-029-fee-payment",target:"_blank",rel:"noopener noreferrer"}},[e._v("general incentivisation design"),o("OutboundLink")],1),e._v(" that can be adopted by any ICS application protocol as "),o("RouterLink",{attrs:{to:"/ibc/middleware/develop.html"}},[e._v("middleware")]),e._v(".")],1),e._v(" "),o("h2",{attrs:{id:"concepts"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#concepts"}},[e._v("#")]),e._v(" Concepts")]),e._v(" "),o("p",[e._v("ICS29 fee payments in this middleware design are built on the assumption that sender chains are the source of incentives — the chain on which packets are incentivized is the chain that distributes fees to relayer operators. However, as part of the IBC packet flow, messages have to be submitted on both sender and destination chains. This introduces the requirement of a mapping of relayer operator's addresses on both chains.")]),e._v(" "),o("blockquote",[o("p",[e._v("To achieve the stated requirements, the "),o("strong",[e._v("fee middleware module has two main groups of functionality")]),e._v(":")])]),e._v(" "),o("ul",[o("li",[o("p",[e._v("Registering of relayer addresses associated with each party involved in relaying the packet on the source chain. This registration process can be automated on start up of relayer infrastructure and happens only once, not every packet flow.")]),e._v(" "),o("p",[e._v("This is described in the "),o("RouterLink",{attrs:{to:"/middleware/ics29-fee/fee-distribution.html"}},[e._v("Fee distribution section")]),e._v(".")],1)]),e._v(" "),o("li",[o("p",[e._v("Escrowing fees by any party which will be paid out to each rightful party on completion of the packet lifecycle.")]),e._v(" "),o("p",[e._v("This is described in the "),o("RouterLink",{attrs:{to:"/middleware/ics29-fee/msgs.html"}},[e._v("Fee messages section")]),e._v(".")],1)])]),e._v(" "),o("p",[e._v("We complete the introduction by giving a list of definitions of relevant terminolgy.")]),e._v(" "),o("p",[o("code",[e._v("Forward relayer")]),e._v(": The relayer that submits the "),o("code",[e._v("MsgRecvPacket")]),e._v(" message for a given packet (on the destination chain).")]),e._v(" "),o("p",[o("code",[e._v("Reverse relayer")]),e._v(": The relayer that submits the "),o("code",[e._v("MsgAcknowledgement")]),e._v(" message for a given packet (on the source chain).")]),e._v(" "),o("p",[o("code",[e._v("Timeout relayer")]),e._v(": The relayer that submits the "),o("code",[e._v("MsgTimeout")]),e._v(" or "),o("code",[e._v("MsgTimeoutOnClose")]),e._v(" messages for a given packet (on the source chain).")]),e._v(" "),o("p",[o("code",[e._v("Payee")]),e._v(": The account address on the source chain to be paid on completion of the packet lifecycle. The packet lifecycle on the source chain completes with the receipt of a "),o("code",[e._v("MsgTimeout")]),e._v("/"),o("code",[e._v("MsgTimeoutOnClose")]),e._v(" or a "),o("code",[e._v("MsgAcknowledgement")]),e._v(".")]),e._v(" "),o("p",[o("code",[e._v("Counterparty payee")]),e._v(": The account address to be paid on completion of the packet lifecycle on the destination chain. The package lifecycle on the destination chain completes with a successful "),o("code",[e._v("MsgRecvPacket")]),e._v(".")]),e._v(" "),o("p",[o("code",[e._v("Refund address")]),e._v(": The address of the account paying for the incentivization of packet relaying. The account is refunded timeout fees upon successful acknowledgement. In the event of a packet timeout, both acknowledgement and receive fees are refunded.")]),e._v(" "),o("h2",{attrs:{id:"known-limitations"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#known-limitations"}},[e._v("#")]),e._v(" Known Limitations")]),e._v(" "),o("p",[e._v("The first version of fee payments middleware will only support incentivisation of new channels, however, channel upgradeability will enable incentivisation of all existing channels.")])])}),[],!1,null,null,null);t.default=n.exports}}]);