const RPC = "https://api.mainnet-beta.solana.com";


export const rpc = async (method:string,params:any[]) =>{
const res = await fetch(RPC,
{
    method:"POST",
    headers:{'Content-Type':"application/json"},
    body:JSON.stringify({jsonrpc:"2.0",id:1,method,params}),
}
);
const json = await res.json();
if(json.error) throw new Error(json.error.message);
return json.result;
};



export const getBalance = async(addr:string)=>{
const res = await rpc("getBalance",[addr]);
return res.value/1_000_000_000;
}

export const getToken = async (addr:string)=>{

    const result = await rpc('getTokenAccountsByOwner',[
     addr,
     {programId :  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
     {encoding:"jsonParsed"}
    ])

    return (result.value || []).map((a:any)=>{
       return { 
        mint: a.account.data.parsed.info.mint,
        amount: a.account.data.parsed.info.uiAmount
       }
    }).filter((t:any)=>t.amount>0);
}

export const getTxn = async (addr:string) =>{
    const sigs = await rpc("getSignaturesForAddress",[
        addr,{limit:10}
    ])
    return sigs.map((s:any)=>{
       return { 
        sig:s.signature,
        time:s.blockTime,
        ok: !s.err
       };

    });
}

export const short = (s:string,n=4) => `${s.slice(0,n)}...${s.slice(-n)}`;

export const timeAgo = (ts:number) =>{
  const s = Math.floor(Date.now()/1000-ts);
  if(s<60) return `${(s)}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}