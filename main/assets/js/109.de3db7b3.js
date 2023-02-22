(window.webpackJsonp=window.webpackJsonp||[]).push([[109],{671:function(e,t,i){"use strict";i.r(t);var a=i(1),s=Object(a.a)({},(function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[i("h1",{attrs:{id:"implementing-the-clientstate-interface"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#implementing-the-clientstate-interface"}},[e._v("#")]),e._v(" Implementing the "),i("code",[e._v("ClientState")]),e._v(" interface")]),e._v(" "),i("p",[e._v("Learn how to implement the "),i("a",{attrs:{href:"https://github.com/cosmos/ibc-go/blob/v6.0.0/modules/core/exported/client.go#L40",target:"_blank",rel:"noopener noreferrer"}},[i("code",[e._v("ClientState")]),i("OutboundLink")],1),e._v(" interface. This list of methods described here does not include all methods of the interface. Some methods are explained in detail in the relevant sections of the guide.")]),e._v(" "),i("h2",{attrs:{id:"clienttype-method"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#clienttype-method"}},[e._v("#")]),e._v(" "),i("code",[e._v("ClientType")]),e._v(" method")]),e._v(" "),i("p",[i("code",[e._v("ClientType")]),e._v(" should return a unique string identifier of the light client. This will be used when generating a client identifier.\nThe format is created as follows: "),i("code",[e._v("ClientType-{N}")]),e._v(" where "),i("code",[e._v("{N}")]),e._v(" is the unique global nonce associated with a specific client.")]),e._v(" "),i("h2",{attrs:{id:"getlatestheight-method"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#getlatestheight-method"}},[e._v("#")]),e._v(" "),i("code",[e._v("GetLatestHeight")]),e._v(" method")]),e._v(" "),i("p",[i("code",[e._v("GetLatestHeight")]),e._v(" should return the latest block height that the client state represents.")]),e._v(" "),i("h2",{attrs:{id:"validate-method"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#validate-method"}},[e._v("#")]),e._v(" "),i("code",[e._v("Validate")]),e._v(" method")]),e._v(" "),i("p",[i("code",[e._v("Validate")]),e._v(" should validate every client state field and should return an error if any value is invalid. The light client\nimplementer is in charge of determining which checks are required. See the "),i("a",{attrs:{href:"https://github.com/cosmos/ibc-go/blob/v6.0.0/modules/light-clients/07-tendermint/types/client_state.go#L101",target:"_blank",rel:"noopener noreferrer"}},[e._v("Tendermint light client implementation"),i("OutboundLink")],1),e._v(" as a reference.")]),e._v(" "),i("h2",{attrs:{id:"status-method"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#status-method"}},[e._v("#")]),e._v(" "),i("code",[e._v("Status")]),e._v(" method")]),e._v(" "),i("p",[i("code",[e._v("Status")]),e._v(" must return the status of the client.")]),e._v(" "),i("ul",[i("li",[e._v("An "),i("code",[e._v("Active")]),e._v(" status indicates that clients are allowed to process packets.")]),e._v(" "),i("li",[e._v("A "),i("code",[e._v("Frozen")]),e._v(" status indicates that misbehaviour was detected in the counterparty chain and the client is not allowed to be used.")]),e._v(" "),i("li",[e._v("An "),i("code",[e._v("Expired")]),e._v(" status indicates that a client is not allowed to be used because it was not updated for longer than the trusting period.")]),e._v(" "),i("li",[e._v("An "),i("code",[e._v("Unknown")]),e._v(" status indicates that there was an error in determining the status of a client.")])]),e._v(" "),i("p",[e._v("All possible "),i("code",[e._v("Status")]),e._v(" types can be found "),i("a",{attrs:{href:"https://github.com/cosmos/ibc-go/blob/v6.0.0/modules/core/exported/client.go#L26-L36",target:"_blank",rel:"noopener noreferrer"}},[e._v("here"),i("OutboundLink")],1),e._v(".")]),e._v(" "),i("p",[e._v("This field is returned in the response of the gRPC "),i("a",{attrs:{href:"https://github.com/cosmos/ibc-go/blob/v6.0.0/modules/core/02-client/types/query.pb.go#L665",target:"_blank",rel:"noopener noreferrer"}},[i("code",[e._v("ibc.core.client.v1.Query/ClientStatus")]),i("OutboundLink")],1),e._v(" endpoint.")]),e._v(" "),i("h2",{attrs:{id:"zerocustomfields-method"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#zerocustomfields-method"}},[e._v("#")]),e._v(" "),i("code",[e._v("ZeroCustomFields")]),e._v(" method")]),e._v(" "),i("p",[i("code",[e._v("ZeroCustomFields")]),e._v(" should return a copy of the light client with all client customizable fields with their zero value. It should not mutate the fields of the light client.\nThis method is used when "),i("a",{attrs:{href:"https://github.com/cosmos/ibc-go/blob/v6.0.0/modules/core/02-client/keeper/proposal.go#L89",target:"_blank",rel:"noopener noreferrer"}},[e._v("scheduling upgrades"),i("OutboundLink")],1),e._v(". Upgrades are used to upgrade chain specific fields.\nIn the tendermint case, this may be the chain ID or the unbonding period.\nFor more information about client upgrades see the "),i("RouterLink",{attrs:{to:"/ibc/light-clients/upgrades.html"}},[e._v("Handling upgrades")]),e._v(" section.")],1),e._v(" "),i("h2",{attrs:{id:"gettimestampatheight-method"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#gettimestampatheight-method"}},[e._v("#")]),e._v(" "),i("code",[e._v("GetTimestampAtHeight")]),e._v(" method")]),e._v(" "),i("p",[i("code",[e._v("GetTimestampAtHeight")]),e._v(" must return the timestamp for the consensus state associated with the provided height.\nThis value is used to facilitate timeouts by checking the packet timeout timestamp against the returned value.")]),e._v(" "),i("h2",{attrs:{id:"initialize-method"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#initialize-method"}},[e._v("#")]),e._v(" "),i("code",[e._v("Initialize")]),e._v(" method")]),e._v(" "),i("p",[e._v("Clients must validate the initial consensus state, and set the initial client state and consensus state in the provided client store.\nClients may also store any necessary client-specific metadata.")]),e._v(" "),i("p",[i("code",[e._v("Initialize")]),e._v(" is called when a "),i("a",{attrs:{href:"https://github.com/cosmos/ibc-go/blob/main/modules/core/02-client/keeper/client.go#L32",target:"_blank",rel:"noopener noreferrer"}},[e._v("client is created"),i("OutboundLink")],1),e._v(".")]),e._v(" "),i("h2",{attrs:{id:"verifymembership-method"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#verifymembership-method"}},[e._v("#")]),e._v(" "),i("code",[e._v("VerifyMembership")]),e._v(" method")]),e._v(" "),i("p",[i("code",[e._v("VerifyMembership")]),e._v(" must verify the existence of a value at a given commitment path at the specified height. For more information about membership proofs\nsee the "),i("RouterLink",{attrs:{to:"/ibc/light-clients/proofs.html"}},[e._v("Existence and non-existence proofs section")]),e._v(".")],1),e._v(" "),i("h2",{attrs:{id:"verifynonmembership-method"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#verifynonmembership-method"}},[e._v("#")]),e._v(" "),i("code",[e._v("VerifyNonMembership")]),e._v(" method")]),e._v(" "),i("p",[i("code",[e._v("VerifyNonMembership")]),e._v(" must verify the absence of a value at a given commitment path at a specified height. For more information about non-membership proofs\nsee the "),i("RouterLink",{attrs:{to:"/ibc/light-clients/proofs.html"}},[e._v("Existence and non-existence proofs section")]),e._v(".")],1),e._v(" "),i("h2",{attrs:{id:"verifyclientmessage-method"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#verifyclientmessage-method"}},[e._v("#")]),e._v(" "),i("code",[e._v("VerifyClientMessage")]),e._v(" method")]),e._v(" "),i("p",[i("code",[e._v("VerifyClientMessage")]),e._v(" must verify a "),i("code",[e._v("ClientMessage")]),e._v(". A "),i("code",[e._v("ClientMessage")]),e._v(" could be a "),i("code",[e._v("Header")]),e._v(", "),i("code",[e._v("Misbehaviour")]),e._v(", or batch update.\nIt must handle each type of "),i("code",[e._v("ClientMessage")]),e._v(" appropriately. Calls to "),i("code",[e._v("CheckForMisbehaviour")]),e._v(", "),i("code",[e._v("UpdateState")]),e._v(", and "),i("code",[e._v("UpdateStateOnMisbehaviour")]),e._v("\nwill assume that the content of the "),i("code",[e._v("ClientMessage")]),e._v(" has been verified and can be trusted. An error should be returned\nif the ClientMessage fails to verify.")]),e._v(" "),i("h2",{attrs:{id:"checkformisbehaviour-method"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#checkformisbehaviour-method"}},[e._v("#")]),e._v(" "),i("code",[e._v("CheckForMisbehaviour")]),e._v(" method")]),e._v(" "),i("p",[e._v("Checks for evidence of a misbehaviour in "),i("code",[e._v("Header")]),e._v(" or "),i("code",[e._v("Misbehaviour")]),e._v(" type. It assumes the "),i("code",[e._v("ClientMessage")]),e._v("\nhas already been verified.")])])}),[],!1,null,null,null);t.default=s.exports}}]);