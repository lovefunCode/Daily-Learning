const oldVNode = {
  type: 'div',
  props: { id: 'app' },
  children: [
    { type: 'h1', props: { style: 'color:red' }, children: ['Hello'] },
    { type: 'p', props: null, children: ['World'] }
  ]
};

const newVNode = {
  type: 'div',
  props: { id: 'app' },
  children: [
    { type: 'h1', props: { style: 'color:blue' }, children: ['Hi'] },
    { type: 'p', props: null, children: ['Everyone'] }
  ]
};

function diff(oldVNode, newVNode){
    
}