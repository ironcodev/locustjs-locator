import { LocatorBase } from "locustjs-locator";
import { isFunction, isObject, isSubClassOf } from "locustjs-base";

function _safeRegister() {
  if (LocatorBase.prototype.safeRegister == null) {
    LocatorBase.prototype.safeRegister = function (
      abstraction,
      concretionRemote,
      concretionFake,
      options
    ) {
      const gotObj = isObject(concretionRemote);

      if (isObject(concretionFake) && options == null) {
        options = concretionFake;
        concretionFake = null;
      }

      if (options == null) {
        options = {};
      }

      const { singleton = false, env } = options;

      if (!this.exists(abstraction, options.state)) {
        if (env != "development") {
          if (singleton || gotObj) {
            if (gotObj) {
              this.registerInstance(
                abstraction,
                concretionRemote,
                undefined,
                options.state
              );
            } else {
              this.registerInstance(
                abstraction,
                new concretionRemote(),
                undefined,
                options.state
              );
            }
          } else {
            if (
              isFunction(concretionRemote) &&
              !isSubClassOf(concretionRemote, abstraction)
            ) {
              this.registerFactory(
                abstraction,
                concretionRemote,
                undefined,
                options.state
              );
            } else {
              this.register(
                abstraction,
                concretionRemote,
                undefined,
                options.state
              );
            }
          }
        } else {
          if (singleton || gotObj) {
            if (!concretionFake) {
              if (gotObj) {
                this.registerInstance(
                  abstraction,
                  concretionRemote,
                  undefined,
                  options.state
                );
              } else {
                this.registerInstance(
                  abstraction,
                  new concretionRemote(),
                  undefined,
                  options.state
                );
              }
            } else {
              this.registerInstance(
                abstraction,
                new concretionFake(),
                undefined,
                options.state
              );
            }
          } else {
            let concretion = concretionFake || concretionRemote;

            if (
              isFunction(concretionRemote) &&
              !isSubClassOf(concretionRemote, abstraction)
            ) {
              this.registerFactory(
                abstraction,
                concretion,
                undefined,
                options.state
              );
            } else {
              this.register(abstraction, concretion, undefined, options.state);
            }
          }
        }
      }
    };
  }
}

function extendLocator() {
  _safeRegister();
}

export default extendLocator;
