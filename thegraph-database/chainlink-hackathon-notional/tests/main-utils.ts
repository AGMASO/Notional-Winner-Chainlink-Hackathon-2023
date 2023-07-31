import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  EscrowClosed,
  EscrowClosedAfterApprove,
  EscrowCreated,
  NewDeveloper
} from "../generated/Main/Main"

export function createEscrowClosedEvent(
  escrowContract: Address,
  issueId: string
): EscrowClosed {
  let escrowClosedEvent = changetype<EscrowClosed>(newMockEvent())

  escrowClosedEvent.parameters = new Array()

  escrowClosedEvent.parameters.push(
    new ethereum.EventParam(
      "escrowContract",
      ethereum.Value.fromAddress(escrowContract)
    )
  )
  escrowClosedEvent.parameters.push(
    new ethereum.EventParam("issueId", ethereum.Value.fromString(issueId))
  )

  return escrowClosedEvent
}

export function createEscrowClosedAfterApproveEvent(
  escrowContract: Address,
  issueId: string
): EscrowClosedAfterApprove {
  let escrowClosedAfterApproveEvent = changetype<EscrowClosedAfterApprove>(
    newMockEvent()
  )

  escrowClosedAfterApproveEvent.parameters = new Array()

  escrowClosedAfterApproveEvent.parameters.push(
    new ethereum.EventParam(
      "escrowContract",
      ethereum.Value.fromAddress(escrowContract)
    )
  )
  escrowClosedAfterApproveEvent.parameters.push(
    new ethereum.EventParam("issueId", ethereum.Value.fromString(issueId))
  )

  return escrowClosedAfterApproveEvent
}

export function createEscrowCreatedEvent(
  escrowContract: Address,
  arbiter: Address,
  depositor: Address,
  amount: BigInt,
  ownerUserName: string,
  issueId: string,
  repo: string,
  url: string
): EscrowCreated {
  let escrowCreatedEvent = changetype<EscrowCreated>(newMockEvent())

  escrowCreatedEvent.parameters = new Array()

  escrowCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "escrowContract",
      ethereum.Value.fromAddress(escrowContract)
    )
  )
  escrowCreatedEvent.parameters.push(
    new ethereum.EventParam("arbiter", ethereum.Value.fromAddress(arbiter))
  )
  escrowCreatedEvent.parameters.push(
    new ethereum.EventParam("depositor", ethereum.Value.fromAddress(depositor))
  )
  escrowCreatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  escrowCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "ownerUserName",
      ethereum.Value.fromString(ownerUserName)
    )
  )
  escrowCreatedEvent.parameters.push(
    new ethereum.EventParam("issueId", ethereum.Value.fromString(issueId))
  )
  escrowCreatedEvent.parameters.push(
    new ethereum.EventParam("repo", ethereum.Value.fromString(repo))
  )
  escrowCreatedEvent.parameters.push(
    new ethereum.EventParam("url", ethereum.Value.fromString(url))
  )

  return escrowCreatedEvent
}

export function createNewDeveloperEvent(
  developer: Address,
  loginName: string
): NewDeveloper {
  let newDeveloperEvent = changetype<NewDeveloper>(newMockEvent())

  newDeveloperEvent.parameters = new Array()

  newDeveloperEvent.parameters.push(
    new ethereum.EventParam("developer", ethereum.Value.fromAddress(developer))
  )
  newDeveloperEvent.parameters.push(
    new ethereum.EventParam("loginName", ethereum.Value.fromString(loginName))
  )

  return newDeveloperEvent
}
