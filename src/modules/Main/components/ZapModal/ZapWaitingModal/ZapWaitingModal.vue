<!-- eslint-disable vuejs-accessibility/anchor-has-content -->
<template>
  <div class="zap-waiting-content">
    <h1>ZAP IN</h1>
    <PoolLabel
      v-if="poolInfo?.address"
      :pool="poolInfo"
    />
    <div class="stages-container">
      <div
        class="stage-row"
        v-for="(stageName, index) in stageNames"
        :key=stageName
      >
        <div class="stage-row-item">
          <div
            v-if="isNextStage(index)"
            class="icon-container"
          >
            <BaseIcon
              class="modal-content__icon"
              name="Clock"
            />
          </div>
          <div
            v-else-if="isCurrentStage(index)"
            class="icon-container"
          >
            <Spinner
              size="30px"
            />
          </div>
          <div
            v-else-if="isPastStage(index)"
            class="icon-container"
          >
            <BaseIcon
              class="modal-content__icon"
              name="CommonSuccess"
            />
          </div>
          <div class="data-container">
            <div>
              {{stageName}}
            </div>
          </div>
          <!-- <div class="button-container">
            <a
              href='https://google.com'
              target="_blank"
              rel="noopener noreferrer"
              class="leave-feedback-link"
            >
              <ButtonComponent btn-styles="link">
                <BaseIcon name="PayoutArrow" />
              </ButtonComponent>
            </a>
          </div> -->
        </div>
      </div>
    </div>
    <!-- <div class="button-container">
      <a
        href='https://google.com'
        target="_blank"
        rel="noopener noreferrer"
        class="leave-feedback-link"
      >
        <ButtonComponent btn-styles="link">
          IN PROGRESS
        </ButtonComponent>
      </a>
    </div> -->
  </div>
</template>

<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
