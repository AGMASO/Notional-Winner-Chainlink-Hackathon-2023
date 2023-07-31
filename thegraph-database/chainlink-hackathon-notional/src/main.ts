import { Address, BigInt} from "@graphprotocol/graph-ts"

import {
  EscrowClosed as EscrowClosedEvent,
  EscrowCreated as EscrowCreatedEvent,
  EscrowClosedAfterApprove as EscrowClosedAfterApproveEvent,
  NewDeveloper as NewDeveloperEvent
} from "../generated/Main/Main"
import { ActiveEscrow, EscrowClosed,EscrowClosedAfterApprove, EscrowCreated, NewDeveloper } from "../generated/schema"



export function handleEscrowCreated(event: EscrowCreatedEvent): void {
  let escrowCreatedObject = EscrowCreated.load(getIdFromEventParams(event.params.issueId, event.params.escrowContract))
  let activeEscrow = ActiveEscrow.load(getIdFromEventParams(event.params.issueId, event.params.escrowContract))
 
  if(!escrowCreatedObject) {
  escrowCreatedObject = new EscrowCreated(getIdFromEventParams(event.params.issueId, event.params.escrowContract))
 }

 if(!activeEscrow){
  activeEscrow = new ActiveEscrow(getIdFromEventParams(event.params.issueId, event.params.escrowContract));
 }


 escrowCreatedObject.escrowContract = event.params.escrowContract;
 activeEscrow.escrowContract  = event.params.escrowContract;

 escrowCreatedObject.amount= event.params.amount;
 activeEscrow.amount= event.params.amount;

 escrowCreatedObject.arbiter = event.params.arbiter;
 activeEscrow.arbiter = event.params.arbiter;

 escrowCreatedObject.depositor = event.params.depositor;
 activeEscrow.depositor = event.params.depositor;

 escrowCreatedObject.issueId = event.params.issueId;
 activeEscrow.issueId = event.params.issueId;

 escrowCreatedObject.repo = event.params.repo;
activeEscrow.repo = event.params.repo;

 escrowCreatedObject.ownerUserName = event.params.ownerUserName;
 activeEscrow.ownerUserName = event.params.ownerUserName;


 escrowCreatedObject.url = event.params.url;
 activeEscrow.url = event.params.url;




 escrowCreatedObject.save()
 activeEscrow.save()
}

export function handleEscrowClosed(event: EscrowClosedEvent): void {
  let escrowClosedObject = EscrowClosed.load(getIdFromEventParams(event.params.issueId, event.params.escrowContract))
  let activeEscrow = ActiveEscrow.load(getIdFromEventParams(event.params.issueId, event.params.escrowContract))
  
  if(!escrowClosedObject){
    escrowClosedObject = new EscrowClosed(getIdFromEventParams(event.params.issueId, event.params.escrowContract))
  }

  escrowClosedObject.escrowContract = event.params.escrowContract;
  escrowClosedObject.issueId= event.params.issueId;
  

  //Igualamos algunas de las address to DEAD address para luego buscar solo los actives 
  //Items que no tienen esta addres, asi sabremos cuales están activos y cuales no

  activeEscrow!.escrowContract = Address.fromString("0x000000000000000000000000000000000000dEaD");

  escrowClosedObject.save()
  activeEscrow!.save()
}
export function handleEscrowClosedAfterApprove(event: EscrowClosedAfterApproveEvent): void {

  
}


export function handleNewDeveloper(event: NewDeveloperEvent): void {



  
}
function getIdFromEventParams(issueId: string, escrowContract: Address): string{
  return issueId.toString() + escrowContract.toHexString();
}

