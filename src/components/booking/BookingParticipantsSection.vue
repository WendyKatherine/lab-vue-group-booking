<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Participant } from '@/domain/booking/entities/Participant'
import type { ValidationError } from '@/domain/booking/rules/ValidationResult'

const props = defineProps<{
  participants: Participant[]
  errors: ValidationError[]
}>()

const emit = defineEmits<{
  'add':         [participant: Participant]
  'update':      [participant: Participant]
  'remove':      [id: string]
  'set-primary': [id: string]
}>()

const newDraft = ref({ firstName: '', lastName: '', email: '' })
const editingId = ref<string | null>(null)
const editDraft = ref({ firstName: '', lastName: '', email: '' })

const participantErrors = computed(() =>
  props.errors.filter(e => e.field === 'participants').map(e => e.message)
)

function startEdit(participant: Participant): void {
  editingId.value = participant.id
  editDraft.value = {
    firstName: participant.firstName,
    lastName: participant.lastName,
    email: participant.email,
  }
}

function cancelEdit(): void {
  editingId.value = null
}

function saveEdit(participant: Participant): void {
  emit('update', {
    ...participant,
    firstName: editDraft.value.firstName.trim(),
    lastName: editDraft.value.lastName.trim(),
    email: editDraft.value.email.trim(),
  })
  editingId.value = null
}

function submitAdd(): void {
  if (!newDraft.value.firstName.trim()) return
  emit('add', {
    id: crypto.randomUUID(),
    firstName: newDraft.value.firstName.trim(),
    lastName: newDraft.value.lastName.trim(),
    email: newDraft.value.email.trim(),
    isPrimaryContact: false,
  })
  newDraft.value = { firstName: '', lastName: '', email: '' }
}
</script>

<template>
  <div class="rt-panel rt-panel--inset quote-field-row flex flex-col gap-4">
    <div class="panel-header flex items-center justify-between gap-2">
      <p class="rt-sidebar-card__eyebrow">Participants</p>
      <span v-if="participants.length > 0" class="rt-badge">
        {{ participants.length }} {{ participants.length === 1 ? 'person' : 'people' }}
      </span>
    </div>

    <div v-if="participantErrors.length > 0" class="flex flex-col gap-1">
      <span
        v-for="(error, i) in participantErrors"
        :key="i"
        class="rt-copy"
        style="color: var(--rt-danger)"
      >
        {{ error }}
      </span>
    </div>

    <table v-if="participants.length > 0" class="table table-sm">
      <thead>
        <tr>
          <th class="rt-sidebar-card__eyebrow">Name</th>
          <th class="rt-sidebar-card__eyebrow">Email</th>
          <th class="rt-sidebar-card__eyebrow">Contact</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="participant in participants" :key="participant.id">

          <tr v-if="editingId !== participant.id">
            <td>{{ participant.firstName }} {{ participant.lastName }}</td>
            <td>{{ participant.email }}</td>
            <td>
              <span v-if="participant.isPrimaryContact" class="rt-badge">Primary</span>
              <button
                v-else
                class="rt-btn rt-btn--ghost btn-row-action"
                type="button"
                @click="emit('set-primary', participant.id)"
              >
                Set as primary
              </button>
            </td>
            <td>
              <div class="flex gap-2">
                <button
                  class="rt-btn rt-btn--ghost btn-row-action"
                  type="button"
                  @click="startEdit(participant)"
                >
                  Edit
                </button>
                <button
                  class="rt-btn rt-btn--ghost btn-row-action btn-row-action--danger"
                  type="button"
                  @click="emit('remove', participant.id)"
                >
                  Remove
                </button>
              </div>
            </td>
          </tr>

          <tr v-else class="bg-base-200">
            <td>
              <div class="flex gap-2">
                <input class="rt-input" v-model="editDraft.firstName" placeholder="First name" />
                <input class="rt-input" v-model="editDraft.lastName" placeholder="Last name" />
              </div>
            </td>
            <td>
              <input class="rt-input" v-model="editDraft.email" placeholder="Email" />
            </td>
            <td></td>
            <td>
              <div class="flex gap-2">
                <button
                  class="rt-btn rt-btn--primary btn-row-action"
                  type="button"
                  @click="saveEdit(participant)"
                >
                  Save
                </button>
                <button
                  class="rt-btn rt-btn--ghost btn-row-action"
                  type="button"
                  @click="cancelEdit"
                >
                  Cancel
                </button>
              </div>
            </td>
          </tr>

        </template>
      </tbody>
    </table>

    <p v-else class="rt-copy">No participants added yet.</p>

    <div class="rt-panel rt-panel--inset quote-field-row p-4 flex flex-col gap-3">
      <div class="panel-header">
        <p class="rt-sidebar-card__eyebrow">Add participant</p>
      </div>
      <form class="flex flex-col gap-3" @submit.prevent="submitAdd">
        <div class="flex gap-3">
          <input class="rt-input" v-model="newDraft.firstName" placeholder="First name" />
          <input class="rt-input" v-model="newDraft.lastName" placeholder="Last name" />
        </div>
        <input class="rt-input" v-model="newDraft.email" placeholder="Email" />
        <div>
          <button class="rt-btn rt-btn--primary" type="submit">Add participant</button>
        </div>
      </form>
    </div>

  </div>
</template>

<style scoped>
.panel-header {
  padding-bottom: 12px;
  border-bottom: 1px solid var(--rt-glass-border-soft);
}

.btn-row-action {
  padding: 4px 8px;
  font-size: var(--rt-text-xs);
}

.btn-row-action--danger {
  color: var(--rt-danger);
}
</style>
