<template>
  <ModalComponent
    type-modal="custom"
    v-model="showModal"
    @close="closeModal"
  >

    <div class="modal-content">
      <BaseIcon
        class="modal-content__icon"
        name="CommonSuccess"
      />
      <h1>
        YOU SUCCESSFULLY ZAP IN
      </h1>

      <span class="divider" />

      <div class="zap-header-container">
        <PoolLabel :pool="successData.pool" />
        <div class="modal-content__data-row">
          <a
            :href="openPositionOnPool"
            target="_blank"
            rel="noopener noreferrer"
            class="view-position-link"
          >
            <ButtonComponent btn-styles="link">
              VIEW POSITION
              <BaseIcon name="PayoutArrow" />
            </ButtonComponent>
          </a>
        </div>
      </div>

      <span class="divider" />

      <div
        v-if="successData"
        class="modal-content__data"
      >

        <div class="modal-content__data-main">
          <div class="data-row sent">
            <div class="success-row-title">
              Sent
            </div>
            <div class="success-data-list">
              <div
                v-for="sentData in tokensSentList"
                :key="sentData.id"
                class="token-amount"
              >
                - {{ sentData.value }}
                {{ sentData.symbol }}
              </div>
            </div>
          </div>

          <div class="data-row returned">
            <div class="success-row-title">Returned</div>
            <div class="success-data-list">
              <div
                v-for="returnData in tokensReturnedList"
                :key="returnData.id"
                class="token-amount"
              >
                + {{ returnData.value }}
                {{ returnData.symbol }}
              </div>
            </div>
          </div>

          <div class="data-row staked">
            <div class="success-row-title">
              Staked
            </div>
            <div class="success-data-list">
              <div
                v-for="stakeData in tokensStakedList"
                :key="stakeData.id"
                class="token-amount"
              >
                + {{ stakeData.value }}
                {{ stakeData.symbol }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <span class="divider" />

      <div class="zap-modal-footer">
        Leave your feedback on Zap In feature and win $50 reward
        <a
          href='https://forms.gle/BCwwX4yhGW7EadTCA'
          target="_blank"
          rel="noopener noreferrer"
          class="leave-feedback-link"
        >
          <ButtonComponent btn-styles="link">
            <BaseIcon name="Pencil" />
            LEAVE FEEDBACK
            <BaseIcon name="Pencil" />
          </ButtonComponent>
        </a>
      </div>
    </div>
  </ModalComponent>
</template>

<script lang="ts" src="./script.ts" />
<style scoped lang="scss" src="./styles.scss" />
