import { useRef, useEffect, useState, Dispatch, SetStateAction, useCallback, EffectCallback, DependencyList } from "react";
import { appService } from "./services";

export function useIsMounted() {
    const isMounted = useRef(false);
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        }
    }, []);

    return isMounted;
}

export function useSafeState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
    const mounted = useIsMounted();
    const [get, set] = useState<S>(initialState);
    const safeSet: Dispatch<SetStateAction<S>> = (s: SetStateAction<S>) => {
        if (mounted.current) {
            set(s);
        }
    }
    return [get, safeSet];
}

export function useAuthenticatedEffect(effect: EffectCallback, deps: DependencyList = []) {
  const isAuthenticated = appService.web3Service.isAuthenticated;
  if (isAuthenticated) {
    useEffect(() => {
      return effect();
    }, [isAuthenticated, ...deps]);
  } else {
    useEffect(() => {
      const exec = async () => {
        await appService.web3Service.tryConnect(false);
        const isAuthenticated = appService.web3Service.isAuthenticated;
        if(isAuthenticated){
          return effect();
        }
      }
      exec();
    }, [isAuthenticated, ...deps]);
    console.warn("[useAuthenticatedEffect] not authenticated")
  }
}
//ALERT
export const ALERT_TIMEOUT = 3000;
export type AlertType = "info" | "success" | "warning" | "danger";
export type Alerter = (a: { type?: AlertType, message?: string, show: boolean }) => void;
export function useAlert(): [AlertModel, Dispatch<SetStateAction<AlertModel>>, Alerter] {
  const [alert, setAlert] = useSafeState<AlertModel>({ show: false });
  const trigger = useCallback(
    (args: { type?: AlertType, message?: string, show: boolean }) => {
      setAlert(_ =>
      ({
        type: args.type,
        message: args.message,
        show: args.show
      })
      );
    }, [])
  return [alert, setAlert, trigger];
}
export type AlertModel = {
    id?: number
    type?: AlertType
    headline?: string
    message?: string
    show?: boolean
}