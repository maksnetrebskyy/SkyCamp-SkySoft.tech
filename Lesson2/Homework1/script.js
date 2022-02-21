let counter = {
    value: 0,
    initialValue: 0,
    next: function() {
      this.value++;
      return this;
    },
    previous: function() {
      this.value--;
      return this;
    },
    reset: function() {
      this.value =this.initialValue;
      return this;
    },
    print: function() {
      console.log(this.value);
      return this;
    }
};