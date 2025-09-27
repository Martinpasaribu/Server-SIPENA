import FacilityModel from "../models/facility_models";


class FacilityService {


async UpdateFacilityItemKey(facilityId: string, itemId: string) {
  try {
    await FacilityModel.findOneAndUpdate(
      { _id: facilityId, isDeleted: false },
      { $addToSet: { items_key:  itemId  } }, // pakai $addToSet biar gak duplikat
      { new: true }
    );
  } catch (error) {
    console.error("❌ Gagal update Facility item_key:", (error as Error).message);
  }
}

}
export const FacilityServices = new FacilityService();
