import axios from 'axios';

export interface CreateProps<entityCreateProp> {
  createPayload: entityCreateProp;
}

export function produceCreateAPI<entityCreateProp>(apiPath: string) {
  return async function ({
    createPayload,
  }: CreateProps<entityCreateProp>): Promise<{ entityId: string }> {
    const res: any = await axios.post(`/api${apiPath}`, createPayload);
    // console.log("" + res.data.id);
    return { entityId: `${res.data.id}` };
  };
}

export interface queryReturnType<returnEntityType> {
  items: returnEntityType[];
}

export function produceQueryAPI<returnEntityType>(apiPath: string) {
  return async function (): Promise<queryReturnType<returnEntityType>> {
    const res = await axios.get(`/api${apiPath}`);
    return { items: res.data };
  };
}

export function produceReadAPI<returnEntityType>(apiPath: string) {
  return async function ({
    id,
  }: {
    id: number;
  }): Promise<{ entity: returnEntityType }> {
    const res: any = await axios.get(`/api${apiPath}/${id}`);
    return { entity: res.data };
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
    await axios.put(`/api${apiPath}/${id}`, updatePayload);
  };
}

export function produceDeleteAPI(apiPath: string) {
  return async function ({ id }: { id: number }): Promise<void> {
    await axios.delete(`/api${apiPath}/${id}`);
  };
}
