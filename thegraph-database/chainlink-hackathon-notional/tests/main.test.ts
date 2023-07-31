import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { EscrowClosed } from "../generated/schema"
import { EscrowClosed as EscrowClosedEvent } from "../generated/Main/Main"
import { handleEscrowClosed } from "../src/main"
import { createEscrowClosedEvent } from "./main-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let escrowContract = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let issueId = "Example string value"
    let newEscrowClosedEvent = createEscrowClosedEvent(escrowContract, issueId)
    handleEscrowClosed(newEscrowClosedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("EscrowClosed created and stored", () => {
    assert.entityCount("EscrowClosed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "EscrowClosed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "escrowContract",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "EscrowClosed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "issueId",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
