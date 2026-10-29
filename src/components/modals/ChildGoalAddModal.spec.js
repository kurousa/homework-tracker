import { describe, it, expect, beforeEach } from "vitest"
import { mount } from "@vue/test-utils"
import ChildGoalAddModal from "@/components/modals/ChildGoalAddModal.vue"

describe("ChildGoalAddModal.vue", () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ChildGoalAddModal)
  })

  it("renders modal header correctly", () => {
    expect(wrapper.find("h2").text()).toBe("じぶんの もくひょう")
  })

  it("emits close event when clicking やめる button", async () => {
    const cancelButton = wrapper.findAll("button").find(btn => btn.text().includes("やめる"))
    await cancelButton.trigger("click")

    expect(wrapper.emitted()).toHaveProperty("close")
  })

  it("emits add and close events with default goal data when clicking つくった！ button", async () => {
    const createButton = wrapper.findAll("button").find(btn => btn.text().includes("つくった！"))
    await createButton.trigger("click")

    expect(wrapper.emitted()).toHaveProperty("add")
    expect(wrapper.emitted("add")[0][0]).toEqual({
      subject: "国語",
      title: "ぷりんと 1まい"
    })
    expect(wrapper.emitted()).toHaveProperty("close")
  })

  it("updates subject, action, and amount correctly before creating goal", async () => {
    // Select 算数 (id: 算数)
    const mathBtn = wrapper.findAll("button").find(btn => btn.text().includes("さんすう"))
    await mathBtn.trigger("click")

    // Select ドリル action
    const drillBtn = wrapper.findAll("button").find(btn => btn.text().includes("ドリル"))
    await drillBtn.trigger("click")

    // Click plus button twice to increase amount to 3
    const plusBtn = wrapper.find("button .fa-plus").element.closest("button")
    await plusBtn.click()
    await plusBtn.click()

    const createButton = wrapper.findAll("button").find(btn => btn.text().includes("つくった！"))
    await createButton.trigger("click")

    expect(wrapper.emitted("add")[0][0]).toEqual({
      subject: "算数",
      title: "ドリル 3ページ"
    })
  })
})
