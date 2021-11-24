import axios from 'axios';
import humps from 'humps';

export interface CreateProps<entityCreateProp> {
  createPayload: entityCreateProp;
}

export function produceCreateAPI<entityCreateProp, returnEntityType>(
  apiPath: string,
) {
  return async function ({
    createPayload,
  }: CreateProps<entityCreateProp>): Promise<{ entity: returnEntityType }> {
    const res: any = await axios.post(
      `${apiPath}`,
      humps.decamelizeKeys(createPayload as unknown as object),
    );
    return {
      entity: humps.camelizeKeys(res.data) as unknown as returnEntityType,
    };
  };
}

export interface queryReturnType<returnEntityType> {
  items: returnEntityType[];
}

export function produceQueryAPI<returnEntityType>(apiPath: string) {
  return async function (): Promise<queryReturnType<returnEntityType>> {
    const res = await axios.get(`${apiPath}`);
    return {
      items: humps.camelizeKeys(res.data) as unknown as returnEntityType[],
    };
  };
}

export function produceReadAPI<returnEntityType>(apiPath: string) {
  return async function ({
    id,
  }: {
    id: number;
  }): Promise<{ entity: returnEntityType }> {
    const res: any = await axios.get(`${apiPath}/${id}`);
    return {
      entity: humps.camelizeKeys(res.data) as unknown as returnEntityType,
    };
  };
}

interface UpdateProps<entityUpdateProp> {
  id: number;
  updatePayload: entityUpdateProp;
}

export function produceUpdateAPI<entityUpdateProp>(apiPath: string) {
  return async function ({
    id,
    updatePayload,
  }: UpdateProps<entityUpdateProp>): Promise<void> {
    await axios.put(`${apiPath}/${id}`, updatePayload);
  };
}

export function produceDeleteAPI(apiPath: string) {
  return async function ({ id }: { id: number }): Promise<void> {
    await axios.delete(`${apiPath}/${id}`);
  };
}
