<!-- src/views/customers/CustomersForm.vue -->
<template>
  <div class="layout">
    <TheHeader />

    <div class="layout__body">
      <main class="layout__main">
        <CustomersFormToolbar :isEdit="isEdit" @cancel="handleCancel" @save="handleSave" @save-add="handleSaveAndAdd" />

        <section class="customers-form-page">
          <div class="customers-form-section">

            <!-- Ảnh -->
            <div class="customers-form-avatar">
              <div class="customers-form-avatar__label">Ảnh</div>

              <!-- 1 khung avatar duy nhất, click để chọn ảnh -->
              <label class="customers-form-avatar__box" title="Chọn ảnh">
                <!-- input ẩn hoàn toàn -->
                <input class="customers-form-avatar__input" type="file" accept="image/*" @change="onPickAvatar" />

                <!-- chưa có ảnh: hiện placeholder icon -->
                <div v-if="!form.avatarPreview" class="customers-form-avatar__placeholder">
                  <span class="icon-img"></span>
                </div>

                <!-- có ảnh: ảnh nằm gọn trong box -->
                <img v-else :src="form.avatarPreview" class="customers-form-avatar__preview" alt="avatar" />
              </label>
            </div>

            <!-- Header Thông tin chung -->
            <h3 class="customers-form-section__title">Thông tin chung</h3>

            <div class="customers-form-grid">
              <!-- LEFT COL -->
              <div class="customers-form-col">
                <!-- Mã KH (readonly) -->
                <div class="form-field">
                  <label class="form-label">Mã khách hàng</label>
                  <div>
                    <input v-model="form.customerCode" class="form-input" disabled placeholder="" />
                  </div>
                </div>

                <div class="form-field">
                  <label class="form-label">Loại khách hàng</label>
                  <div>
                    <select v-model="form.customerType" class="form-input" @change="onInput('customerType')"
                      @blur="onBlur('customerType')">
                      <option value="">-- Chọn loại khách hàng --</option>
                      <option v-for="t in customerTypes" :key="t" :value="t">
                        {{ t }}
                      </option>
                    </select>
                    <p v-if="showErr('customerType')" class="form-error">
                      {{ errors.customerType }}
                    </p>
                  </div>
                </div>

                <div class="form-field">
                  <label class="form-label">
                    Tên khách hàng <span class="req">*</span>
                  </label>
                  <div>
                    <input v-model="form.customerName" class="form-input" @input="onInput('customerName')"
                      @blur="onBlur('customerName')" />
                    <p v-if="showErr('customerName')" class="form-error">
                      {{ errors.customerName }}
                    </p>
                  </div>
                </div>

                <div class="form-field">
                  <label class="form-label">Mã số thuế</label>
                  <div>
                    <input v-model="form.taxCode" class="form-input" @input="onInput('taxCode')"
                      @blur="onBlur('taxCode')" />
                    <p v-if="showErr('taxCode')" class="form-error">
                      {{ errors.taxCode }}
                    </p>
                  </div>
                </div>

                <div class="form-field">
                  <label class="form-label">Địa chỉ (Giao hàng)</label>
                  <div>
                    <input v-model="form.shippingAddress" class="form-input" @input="onInput('shippingAddress')"
                      @blur="onBlur('shippingAddress')" />
                    <p v-if="showErr('shippingAddress')" class="form-error">
                      {{ errors.shippingAddress }}
                    </p>
                  </div>
                </div>

                <div class="form-field">
                  <label class="form-label">Địa chỉ (Hóa đơn)</label>
                  <div>
                    <input v-model="form.billingAddress" class="form-input" @input="onInput('billingAddress')"
                      @blur="onBlur('billingAddress')" />
                    <p v-if="showErr('billingAddress')" class="form-error">
                      {{ errors.billingAddress }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- RIGHT COL -->
              <div class="customers-form-col">
                <div class="form-field">
                  <label class="form-label">Điện thoại</label>
                  <div>
                    <input v-model="form.phone" class="form-input" @input="onInput('phone')" @blur="onBlur('phone')" />
                    <p v-if="showErr('phone')" class="form-error">
                      {{ errors.phone }}
                    </p>
                  </div>
                </div>

                <div class="form-field">
                  <label class="form-label">Email</label>
                  <div>
                    <input v-model="form.email" class="form-input" @input="onInput('email')" @blur="onBlur('email')" />
                    <p v-if="showErr('email')" class="form-error">
                      {{ errors.email }}
                    </p>
                  </div>
                </div>

                <div class="form-field">
                  <label class="form-label">Ngày mua gần nhất</label>
                  <div>
                    <input v-model="form.lastPurchaseDate" class="form-input" type="date"
                      @input="onInput('lastPurchaseDate')" @blur="onBlur('lastPurchaseDate')" />
                    <p v-if="showErr('lastPurchaseDate')" class="form-error">
                      {{ errors.lastPurchaseDate }}
                    </p>
                  </div>
                </div>

                <div class="form-field">
                  <label class="form-label">Hàng hóa đã mua</label>
                  <div>
                    <input v-model="form.purchasedGoods" class="form-input" @input="onInput('purchasedGoods')"
                      @blur="onBlur('purchasedGoods')" />
                    <p v-if="showErr('purchasedGoods')" class="form-error">
                      {{ errors.purchasedGoods }}
                    </p>
                  </div>
                </div>

                <div class="form-field">
                  <label class="form-label">Tên hàng hóa đã mua</label>
                  <div>
                    <input v-model="form.goodsName" class="form-input" @input="onInput('goodsName')"
                      @blur="onBlur('goodsName')" />
                    <p v-if="showErr('goodsName')" class="form-error">
                      {{ errors.goodsName }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <!-- end grid -->
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import TheHeader from "@/layouts/TheHeader.vue";
import CustomersFormToolbar from "./CustomersFormToolbar.vue";
import { useToast } from "@/components/ms-toast/useToast";
import { useConfirm } from "@/components/ms-dialog/useConfirm";
import {
  getCustomerById,
  createCustomer,
  updateCustomer,
  getCustomers, // ✅ dùng để check trùng
} from "@/api/customersApi";

const toast = useToast();
const confirm = useConfirm();

const route = useRoute();
const router = useRouter();

const saving = ref(false);
const id = computed(() => route.params.id || null);
const isEdit = computed(() => !!id.value);

const customerTypes = ["NBH01", "LKHA", "VIP"];

const emptyForm = () => ({
  customerId: null,
  customerCode: null,
  customerType: "",
  customerName: "",
  taxCode: "",
  shippingAddress: "",
  billingAddress: "",
  phone: "",
  email: "",
  lastPurchaseDate: "",
  purchasedGoods: "",
  goodsName: "",
  status: true,

  avatarPreview: "",
  avatarFile: null,
});

const form = reactive(emptyForm());
const initialSnapshot = ref(JSON.stringify(emptyForm()));

const errors = reactive({
  customerType: "",
  customerName: "",
  taxCode: "",
  shippingAddress: "",
  billingAddress: "",
  phone: "",
  email: "",
  lastPurchaseDate: "",
  purchasedGoods: "",
  goodsName: "",
});

const touched = reactive({
  customerType: false,
  customerName: false,
  taxCode: false,
  shippingAddress: false,
  billingAddress: false,
  phone: false,
  email: false,
  lastPurchaseDate: false,
  purchasedGoods: false,
  goodsName: false,
});

const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/i;
const phoneRegex = /^\d{10,11}$/;

/* =========================
   Validate format
   ========================= */
function validateField(field) {
  const v = (form[field] ?? "").toString().trim();

  switch (field) {
    case "customerType":
      if (v && !customerTypes.includes(v))
        errors.customerType = "Loại khách hàng không hợp lệ.";
      else errors.customerType = "";
      break;

    case "customerName":
      if (!v) errors.customerName = "Tên khách hàng là bắt buộc.";
      else if (v.length > 128)
        errors.customerName = "Tên khách hàng tối đa 128 ký tự.";
      else errors.customerName = "";
      break;

    case "shippingAddress":
      if (v && v.length > 255)
        errors.shippingAddress = "Địa chỉ giao hàng tối đa 255 ký tự.";
      else errors.shippingAddress = "";
      break;

    case "billingAddress":
      if (v && v.length > 255)
        errors.billingAddress = "Địa chỉ hóa đơn tối đa 255 ký tự.";
      else errors.billingAddress = "";
      break;

    case "email":
      if (v && !emailRegex.test(v))
        errors.email = "Email không đúng định dạng.";
      else errors.email = "";
      break;

    case "phone":
      if (v && !phoneRegex.test(v))
        errors.phone = "Số điện thoại phải 10–11 chữ số.";
      else errors.phone = "";
      break;

    default:
      errors[field] = "";
      break;
  }
}

function validateAll() {
  Object.keys(errors).forEach((f) => {
    validateField(f);
    touched[f] = true;
  });
  return Object.values(errors).every((m) => !m);
}

/* =========================
   Check duplicate (Email/Phone)
   ========================= */
async function checkDuplicateEmail() {
  const v = (form.email || "").trim();
  if (!v) return;

  try {
    const res = await getCustomers({
      page: 1,
      pageSize: 5,
      email: v,
      includeInactive: false,
    });
    const list = res.data?.data || [];
    const exists = list.some((c) => c.customerId !== form.customerId);

    if (exists) {
      errors.email = "Email đã tồn tại. Vui lòng nhập email khác.";
      toast.error("Email đã tồn tại, vui lòng nhập email khác.");
    }
  } catch (e) {
    console.error("checkDuplicateEmail error:", e);
  }
}

async function checkDuplicatePhone() {
  const v = (form.phone || "").trim();
  if (!v) return;

  try {
    const res = await getCustomers({
      page: 1,
      pageSize: 5,
      phone: v,
      includeInactive: false,
    });
    const list = res.data?.data || [];
    const exists = list.some((c) => c.customerId !== form.customerId);

    if (exists) {
      errors.phone = "Số điện thoại đã tồn tại. Vui lòng nhập số khác.";
      toast.error("Số điện thoại đã tồn tại, vui lòng nhập số khác.");
    }
  } catch (e) {
    console.error("checkDuplicatePhone error:", e);
  }
}

/* =========================
   Input events
   ========================= */
function onInput(field) {
  touched[field] = true;
  validateField(field);
}

function onBlur(field) {
  touched[field] = true;
  validateField(field);

  // ✅ format ok thì mới check trùng
  if (!errors[field]) {
    if (field === "email") checkDuplicateEmail();
    if (field === "phone") checkDuplicatePhone();
  }
}

function showErr(field) {
  return touched[field] && !!errors[field];
}

/* =========================
   Map DTO
   ========================= */
function mapDtoToForm(dto) {
  form.customerId = dto.customerId ?? null;
  form.customerCode = dto.customerCode ?? null;
  form.customerType = dto.customerType ?? "";
  form.customerName = dto.customerName ?? "";
  form.taxCode = dto.taxCode ?? "";
  form.shippingAddress = dto.shippingAddress ?? "";
  form.billingAddress = dto.billingAddress ?? "";
  form.phone = dto.phone ?? "";
  form.email = dto.email ?? "";
  form.purchasedGoods = dto.purchasedGoods ?? "";
  form.goodsName = dto.goodsName ?? "";
  form.status = dto.status ?? true;

  if (dto.lastPurchaseDate) {
    const d = new Date(dto.lastPurchaseDate);
    form.lastPurchaseDate = isNaN(d) ? "" : d.toISOString().slice(0, 10);
  } else {
    form.lastPurchaseDate = "";
  }
}

function buildDtoFromForm() {
  return {
    customerId: form.customerId,
    customerCode: form.customerCode,
    customerType: form.customerType || null,
    customerName: form.customerName?.trim(),
    taxCode: form.taxCode || null,
    shippingAddress: form.shippingAddress || null,
    billingAddress: form.billingAddress || null,
    phone: form.phone || null,
    email: form.email || null,
    lastPurchaseDate: form.lastPurchaseDate
      ? new Date(form.lastPurchaseDate).toISOString()
      : null,
    purchasedGoods: form.purchasedGoods || null,
    goodsName: form.goodsName || null,
    status: form.status ?? true,
  };
}

const isDirty = computed(() => {
  return JSON.stringify(buildDtoFromForm()) !== initialSnapshot.value;
});

/* =========================
   Load edit
   ========================= */
async function loadDetailIfEdit() {
  if (!isEdit.value) {
    initialSnapshot.value = JSON.stringify(buildDtoFromForm());
    return;
  }
  try {
    const res = await getCustomerById(id.value);
    const dto = res.data?.data;
    if (dto) {
      mapDtoToForm(dto);
      initialSnapshot.value = JSON.stringify(buildDtoFromForm());
      Object.keys(touched).forEach((k) => (touched[k] = false));
      Object.keys(errors).forEach((k) => (errors[k] = ""));
    }
  } catch (e) {
    toast.error("Không tải được dữ liệu khách hàng.");
    console.error(e);
  }
}

onMounted(loadDetailIfEdit);

/* =========================
   Avatar UI
   ========================= */
function onPickAvatar(e) {
  const f = e.target.files?.[0];
  if (!f) return;
  form.avatarFile = f;
  form.avatarPreview = URL.createObjectURL(f);
}

/* =========================
   Save core (Dialog mới)
   ========================= */
async function saveCore() {
  if (!validateAll()) {
    toast.error("Vui lòng kiểm tra dữ liệu.");
    return null;
  }

  // ✅ đảm bảo không lọt trùng nếu user chưa blur
  if (!errors.email) await checkDuplicateEmail();
  if (!errors.phone) await checkDuplicatePhone();

  if (errors.email || errors.phone) {
    toast.error("Vui lòng kiểm tra dữ liệu trùng Email/SĐT.");
    return null;
  }

  const confirmMsg = isEdit.value
    ? "Xác nhận lưu thay đổi khách hàng?"
    : "Xác nhận thêm khách hàng?";

  const ok = await confirm.confirm({
    title: "Xác nhận lưu",
    message: confirmMsg,
    confirmText: "Lưu",
    cancelText: "Hủy",
  });
  if (!ok) return null;

  saving.value = true;
  try {
    const dto = buildDtoFromForm();
    let saved = null;

    if (isEdit.value) {
      const res = await updateCustomer(id.value, dto);
      saved = res.data?.data || null;
      toast.success("Cập nhật khách hàng thành công.");
    } else {
      const res = await createCustomer(dto);
      saved = res.data?.data || null;
      toast.success("Thêm khách hàng thành công.");
    }

    if (saved?.customerId) {
      sessionStorage.setItem("customers:lastChangedId", saved.customerId);
    }
    return saved;
  } catch (e) {
    const msg =
      e?.response?.data?.error?.message ||
      e?.response?.data?.message ||
      "Lưu thất bại.";
    toast.error(msg);
    console.error(e);
    return null;
  } finally {
    saving.value = false;
  }
}

async function handleSaveAndAdd() {
  const saved = await saveCore();
  if (!saved) return;

  Object.assign(form, emptyForm());
  initialSnapshot.value = JSON.stringify(buildDtoFromForm());
  Object.keys(touched).forEach((k) => (touched[k] = false));
  Object.keys(errors).forEach((k) => (errors[k] = ""));
}

async function handleSave() {
  const saved = await saveCore();
  if (!saved) return;
  router.push("/customers");
}

/* =========================
   Cancel (Dialog mới)
   ========================= */
async function handleCancel() {
  const msg = isDirty.value
    ? "Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ mất."
    : "Bạn muốn quay lại danh sách khách hàng?";

  const ok = await confirm.confirm({
    title: "Xác nhận hủy",
    message: msg,
    confirmText: "Đồng ý",
    cancelText: "Không",
  });
  if (!ok) return;

  router.push("/customers");
}
</script>
