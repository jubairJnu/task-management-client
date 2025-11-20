import React from 'react';

const AssignOverLoadModal = () => {
    return (
      <div>
        <Dialog open={showWarning} onOpenChange={setShowWarning}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Member Overloaded</DialogTitle>
              <DialogDescription>
                {selectedMember?.name} has {selectedMember?.currentTasks} tasks
                but capacity is {selectedMember?.capacity}. Assign anyway?
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowWarning(false);
                  // do not assign
                }}
              >
                Choose Another
              </Button>

              <Button
                onClick={() => {
                  field.onChange(selectedMember._id); // assign anyway
                  setShowWarning(false);
                }}
              >
                Assign Anyway
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
};

export default AssignOverLoadModal;