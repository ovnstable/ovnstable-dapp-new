/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
export const beforeEnterList = (el: any) => {
  el.style.opacity = 0;
  el.style.transform = 'translateX(-10px)';
};

export const onEnterList = (el: any, done: any) => {
  const delay = el.dataset.index * 100;
  setTimeout(() => {
    el.style.opacity = 1;
    el.style.transform = 'translateX(0)';
    done();
  }, delay);
};

export const onLeaveList = (el: any, done: VoidFunction) => {
  const delay = el.dataset.index * 100;
  setTimeout(() => {
    el.style.opacity = 1;
    el.style.transform = 'translateX(-50px)';
    done();
  }, delay);
};
